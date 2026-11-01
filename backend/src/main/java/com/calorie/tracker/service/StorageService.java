package com.calorie.tracker.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Slf4j
@Service
public class StorageService {

    private static final long MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

    @Value("${supabase.storage.enabled:false}")
    private boolean supabaseEnabled;

    @Value("${supabase.url:}")
    private String supabaseUrl;

    @Value("${supabase.key:}")
    private String supabaseKey;

    @Value("${supabase.bucket-name:meals}")
    private String bucketName;

    @Value("${storage.local-dir:./uploads}")
    private String localStorageDir;

    private RestTemplate restTemplate;

    public StorageService() {
        this.restTemplate = createDefaultRestTemplate();
    }

    public StorageService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate != null ? restTemplate : createDefaultRestTemplate();
    }

    private static RestTemplate createDefaultRestTemplate() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(5000);  // 5 giây kết nối
        factory.setReadTimeout(10000);    // 10 giây đọc dữ liệu
        return new RestTemplate(factory);
    }

    @Autowired(required = false)
    public void setRestTemplate(RestTemplate restTemplate) {
        if (restTemplate != null) {
            this.restTemplate = restTemplate;
        }
    }

    public void setSupabaseConfig(boolean enabled, String url, String key, String bucket) {
        this.supabaseEnabled = enabled;
        this.supabaseUrl = url;
        this.supabaseKey = key;
        this.bucketName = bucket;
    }

    public void setLocalStorageDir(String dir) {
        this.localStorageDir = dir;
    }

    /**
     * Lưu trữ tệp hình ảnh.
     * Validate định dạng MIME và kích thước tệp.
     * Nếu Supabase Storage được kích hoạt và cấu hình đầy đủ, tệp sẽ được tải lên Supabase Bucket.
     * Nếu không hoặc nếu xảy ra lỗi trong quá trình tải lên, hệ thống tự động fallback lưu cục bộ.
     *
     * @param file Tệp hình ảnh tải lên từ client
     * @return URL công khai (Supabase public CDN URL hoặc đường dẫn cục bộ /uploads/...)
     */
    public String storeFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File upload không được để trống");
        }

        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
            throw new IllegalArgumentException("Kích thước tệp vượt quá giới hạn cho phép (tối đa 5MB)");
        }

        String contentType = file.getContentType();
        if (contentType != null && !contentType.isBlank() && !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Định dạng tệp không hợp lệ. Chỉ chấp nhận tệp hình ảnh (JPEG, PNG, WebP)");
        }

        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        } else {
            extension = ".jpg";
        }

        String uniqueFilename = UUID.randomUUID().toString() + extension;

        if (supabaseEnabled && isSupabaseConfigured()) {
            try {
                return uploadToSupabase(file, uniqueFilename);
            } catch (HttpStatusCodeException e) {
                log.warn("Lỗi upload Supabase Storage (HTTP {}): {}, chuyển sang lưu trữ cục bộ...",
                        e.getStatusCode(), e.getResponseBodyAsString());
                return storeLocally(file, uniqueFilename);
            } catch (Exception e) {
                log.warn("Lỗi upload Supabase Storage ({}), chuyển sang lưu trữ cục bộ...", e.getMessage());
                return storeLocally(file, uniqueFilename);
            }
        } else {
            return storeLocally(file, uniqueFilename);
        }
    }

    private boolean isSupabaseConfigured() {
        return supabaseUrl != null && !supabaseUrl.isBlank()
                && supabaseKey != null && !supabaseKey.isBlank();
    }

    private String getNormalizedBaseUrl() {
        String cleanUrl = supabaseUrl.trim().replaceAll("/+$", "");
        if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
            cleanUrl = "https://" + cleanUrl;
        }
        return cleanUrl;
    }

    private String uploadToSupabase(MultipartFile file, String filename) throws IOException {
        String baseUrl = getNormalizedBaseUrl();
        String uploadUrl = String.format("%s/storage/v1/object/%s/%s", baseUrl, bucketName, filename);

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + supabaseKey.trim());
        headers.set("apiKey", supabaseKey.trim());

        String contentType = file.getContentType();
        if (contentType == null || contentType.isBlank()) {
            contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
        }
        headers.setContentType(MediaType.parseMediaType(contentType));
        headers.set("x-upsert", "true");

        HttpEntity<byte[]> requestEntity = new HttpEntity<>(file.getBytes(), headers);

        ResponseEntity<String> response = restTemplate.exchange(
                uploadUrl,
                HttpMethod.POST,
                requestEntity,
                String.class
        );

        if (response.getStatusCode().is2xxSuccessful()) {
            String publicUrl = String.format("%s/storage/v1/object/public/%s/%s", baseUrl, bucketName, filename);
            log.info("Upload ảnh lên Supabase Storage thành công: {}", publicUrl);
            return publicUrl;
        } else {
            throw new RuntimeException("Phản hồi không thành công từ Supabase Storage: HTTP " + response.getStatusCode());
        }
    }

    private String storeLocally(MultipartFile file, String filename) {
        try {
            Path targetDir = Paths.get(localStorageDir).toAbsolutePath().normalize();
            if (!Files.exists(targetDir)) {
                Files.createDirectories(targetDir);
            }

            Path targetLocation = targetDir.resolve(filename).normalize();
            if (!targetLocation.startsWith(targetDir)) {
                throw new SecurityException("Phát hiện hành vi Path Traversal không hợp lệ: " + filename);
            }

            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, targetLocation, StandardCopyOption.REPLACE_EXISTING);
            }

            return "/uploads/" + filename;
        } catch (IOException e) {
            log.error("Lỗi khi lưu file cục bộ: {}", e.getMessage());
            throw new RuntimeException("Không thể lưu trữ hình ảnh", e);
        }
    }

    /**
     * Xóa tệp hình ảnh theo URL (hỗ trợ cả Supabase Storage URL và đường dẫn cục bộ).
     *
     * @param fileUrl URL của tệp cần xóa
     */
    public void deleteFile(String fileUrl) {
        if (fileUrl == null || fileUrl.isBlank()) {
            return;
        }

        try {
            if (fileUrl.contains("/storage/v1/object/public/")) {
                deleteFromSupabase(fileUrl);
            } else if (fileUrl.startsWith("/uploads/")) {
                deleteFromLocal(fileUrl);
            }
        } catch (Exception e) {
            log.warn("Không thể xóa file {}: {}", fileUrl, e.getMessage());
        }
    }

    private void deleteFromSupabase(String fileUrl) {
        if (!isSupabaseConfigured()) {
            return;
        }
        String marker = "/storage/v1/object/public/" + bucketName + "/";
        int idx = fileUrl.indexOf(marker);
        if (idx == -1) {
            return;
        }
        String filename = fileUrl.substring(idx + marker.length());
        String baseUrl = getNormalizedBaseUrl();
        String deleteUrl = String.format("%s/storage/v1/object/%s/%s", baseUrl, bucketName, filename);

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + supabaseKey.trim());
        headers.set("apiKey", supabaseKey.trim());

        HttpEntity<Void> requestEntity = new HttpEntity<>(headers);
        restTemplate.exchange(deleteUrl, HttpMethod.DELETE, requestEntity, String.class);
        log.info("Đã xóa file khỏi Supabase Storage: {}", filename);
    }

    private void deleteFromLocal(String fileUrl) {
        String filename = fileUrl.replaceFirst("^/uploads/", "");
        Path targetDir = Paths.get(localStorageDir).toAbsolutePath().normalize();
        Path targetFile = targetDir.resolve(filename).normalize();
        if (!targetFile.startsWith(targetDir)) {
            throw new SecurityException("Phát hiện hành vi Path Traversal không hợp lệ: " + filename);
        }

        try {
            Files.deleteIfExists(targetFile);
            log.info("Đã xóa file cục bộ: {}", filename);
        } catch (IOException e) {
            log.warn("Không thể xóa file cục bộ {}: {}", filename, e.getMessage());
        }
    }
}
