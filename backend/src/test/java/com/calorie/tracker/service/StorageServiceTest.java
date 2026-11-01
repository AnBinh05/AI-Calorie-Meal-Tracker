package com.calorie.tracker.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.io.TempDir;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.nio.file.Path;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StorageServiceTest {

    @Mock
    private RestTemplate restTemplate;

    private StorageService storageService;

    @TempDir
    Path tempUploadDir;

    @BeforeEach
    void setUp() {
        storageService = new StorageService(restTemplate);
        storageService.setLocalStorageDir(tempUploadDir.toString());
    }

    @Test
    @DisplayName("Ném ngoại lệ IllegalArgumentException khi tải lên tệp rỗng")
    void testStoreFileThrowsOnEmptyFile() {
        MockMultipartFile emptyFile = new MockMultipartFile("image", "test.jpg", "image/jpeg", new byte[0]);

        assertThatThrownBy(() -> storageService.storeFile(emptyFile))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("File upload không được để trống");
    }

    @Test
    @DisplayName("Ném ngoại lệ IllegalArgumentException khi kích thước ảnh vượt quá 5MB")
    void testStoreFileThrowsOnOversizedFile() {
        byte[] oversizedBytes = new byte[6 * 1024 * 1024]; // 6MB
        MockMultipartFile bigFile = new MockMultipartFile("image", "large.jpg", "image/jpeg", oversizedBytes);

        assertThatThrownBy(() -> storageService.storeFile(bigFile))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Kích thước tệp vượt quá giới hạn");
    }

    @Test
    @DisplayName("Ném ngoại lệ IllegalArgumentException khi định dạng tệp không phải là ảnh")
    void testStoreFileThrowsOnInvalidMimeType() {
        MockMultipartFile textFile = new MockMultipartFile("image", "test.txt", "text/plain", "hello".getBytes());

        assertThatThrownBy(() -> storageService.storeFile(textFile))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Định dạng tệp không hợp lệ");
    }

    @Test
    @DisplayName("Lưu trữ tệp cục bộ khi Supabase Storage bị tắt (mặc định cho dev local)")
    void testStoreFileLocallyWhenSupabaseDisabled() {
        MockMultipartFile file = new MockMultipartFile(
                "image", "dinner.png", "image/png", "fake image content".getBytes()
        );

        storageService.setSupabaseConfig(false, "", "", "meals");

        String resultPath = storageService.storeFile(file);

        assertThat(resultPath).startsWith("/uploads/");
        assertThat(resultPath).endsWith(".png");
        verifyNoInteractions(restTemplate);
    }

    @Test
    @DisplayName("Tải tệp thành công lên Supabase Storage và nhận lại Public CDN URL")
    void testStoreFileSupabaseSuccess() {
        MockMultipartFile file = new MockMultipartFile(
                "image", "salad.jpg", "image/jpeg", "image bytes".getBytes()
        );

        storageService.setSupabaseConfig(true, "https://myproject.supabase.co", "test-key-123", "meals");

        when(restTemplate.exchange(
                anyString(),
                eq(HttpMethod.POST),
                any(),
                eq(String.class)
        )).thenReturn(new ResponseEntity<>("{\"Id\":\"123\"}", HttpStatus.OK));

        String resultUrl = storageService.storeFile(file);

        assertThat(resultUrl).startsWith("https://myproject.supabase.co/storage/v1/object/public/meals/");
        assertThat(resultUrl).endsWith(".jpg");

        verify(restTemplate, times(1)).exchange(
                contains("/storage/v1/object/meals/"),
                eq(HttpMethod.POST),
                any(),
                eq(String.class)
        );
    }

    @Test
    @DisplayName("Tự động fallback lưu cục bộ khi kết nối Supabase Storage gặp sự cố")
    void testStoreFileSupabaseFallbackOnException() {
        MockMultipartFile file = new MockMultipartFile(
                "image", "pho.jpg", "image/jpeg", "image bytes".getBytes()
        );

        storageService.setSupabaseConfig(true, "https://myproject.supabase.co", "test-key-123", "meals");

        when(restTemplate.exchange(
                anyString(),
                eq(HttpMethod.POST),
                any(),
                eq(String.class)
        )).thenThrow(new RestClientException("Connection timed out"));

        String resultUrl = storageService.storeFile(file);

        // Fallback lưu cục bộ an toàn
        assertThat(resultUrl).startsWith("/uploads/");
        assertThat(resultUrl).endsWith(".jpg");
    }

    @Test
    @DisplayName("Xóa tệp từ Supabase Storage khi nhận được URL hợp lệ")
    void testDeleteFileFromSupabase() {
        storageService.setSupabaseConfig(true, "https://myproject.supabase.co", "test-key-123", "meals");

        String fileUrl = "https://myproject.supabase.co/storage/v1/object/public/meals/uuid-photo.jpg";

        storageService.deleteFile(fileUrl);

        verify(restTemplate, times(1)).exchange(
                eq("https://myproject.supabase.co/storage/v1/object/meals/uuid-photo.jpg"),
                eq(HttpMethod.DELETE),
                any(),
                eq(String.class)
        );
    }
}
