package com.calorie.tracker.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Slf4j
@Service
public class StorageService {

    @Value("${aws.s3.enabled:false}")
    private boolean s3Enabled;

    @Value("${aws.s3.bucket-name:calorie-tracker-meals}")
    private String bucketName;

    @Value("${aws.s3.region:ap-southeast-1}")
    private String awsRegion;

    @Value("${aws.s3.access-key:}")
    private String accessKey;

    @Value("${aws.s3.secret-key:}")
    private String secretKey;

    @Value("${storage.local-dir:./uploads}")
    private String localStorageDir;

    public String storeFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File upload không được để trống");
        }

        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        } else {
            extension = ".jpg";
        }

        String uniqueFilename = UUID.randomUUID().toString() + extension;

        if (s3Enabled && !accessKey.isBlank() && !secretKey.isBlank()) {
            try {
                return uploadToS3(file, uniqueFilename);
            } catch (Exception e) {
                log.warn("Lỗi upload S3, chuyển sang lưu trữ cục bộ: {}", e.getMessage());
                return storeLocally(file, uniqueFilename);
            }
        } else {
            return storeLocally(file, uniqueFilename);
        }
    }

    private String uploadToS3(MultipartFile file, String filename) throws IOException {
        S3Client s3Client = S3Client.builder()
                .region(Region.of(awsRegion))
                .credentialsProvider(StaticCredentialsProvider.create(AwsBasicCredentials.create(accessKey, secretKey)))
                .build();

        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key("meals/" + filename)
                .contentType(file.getContentType())
                .build();

        s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
        return String.format("https://%s.s3.%s.amazonaws.com/meals/%s", bucketName, awsRegion, filename);
    }

    private String storeLocally(MultipartFile file, String filename) {
        try {
            Path targetDir = Paths.get(localStorageDir).toAbsolutePath().normalize();
            if (!Files.exists(targetDir)) {
                Files.createDirectories(targetDir);
            }

            Path targetLocation = targetDir.resolve(filename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return "/uploads/" + filename;
        } catch (IOException e) {
            log.error("Lỗi khi lưu file cục bộ: {}", e.getMessage());
            throw new RuntimeException("Không thể lưu trữ hình ảnh", e);
        }
    }
}
