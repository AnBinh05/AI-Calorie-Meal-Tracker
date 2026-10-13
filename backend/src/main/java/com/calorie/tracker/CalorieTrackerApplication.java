package com.calorie.tracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;

@SpringBootApplication
public class CalorieTrackerApplication {

    public static void main(String[] args) {
        loadDotEnvIfExists();
        SpringApplication.run(CalorieTrackerApplication.class, args);
    }

    /**
     * Tự động nạp các biến từ file .env vào System Properties khi chạy cục bộ.
     * Cơ chế này đảm bảo API keys và bí mật nằm trong .env, không bao giờ bị hardcode vào mã nguồn.
     */
    private static void loadDotEnvIfExists() {
        File[] candidates = new File[] {
                new File(".env"),
                new File("backend/.env"),
                new File("../.env")
        };

        for (File envFile : candidates) {
            if (envFile.exists() && envFile.isFile()) {
                try (BufferedReader reader = new BufferedReader(new FileReader(envFile))) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        line = line.trim();
                        if (line.isEmpty() || line.startsWith("#")) {
                            continue;
                        }
                        int eqIdx = line.indexOf('=');
                        if (eqIdx > 0) {
                            String key = line.substring(0, eqIdx).trim();
                            String value = line.substring(eqIdx + 1).trim();
                            if ((value.startsWith("\"") && value.endsWith("\"")) ||
                                (value.startsWith("'") && value.endsWith("'"))) {
                                value = value.substring(1, value.length() - 1);
                            }
                            if (!key.isEmpty() && !value.isEmpty() && System.getProperty(key) == null && System.getenv(key) == null) {
                                System.setProperty(key, value);
                            }
                        }
                    }
                    break;
                } catch (IOException ignored) {
                }
            }
        }
    }
}

