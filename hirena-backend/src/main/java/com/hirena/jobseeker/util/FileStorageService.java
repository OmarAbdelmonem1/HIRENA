package com.hirena.jobseeker.util;

import com.hirena.jobseeker.exception.BadRequestException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Set;
import java.util.UUID;

/**
 * Stores uploaded files on the local filesystem.
 * Configure base paths in application.properties:
 *
 *   app.upload.profile-image-dir=uploads/profile-images
 *   app.upload.cv-dir=uploads/cvs
 *   app.upload.max-image-size-mb=5
 *   app.upload.max-cv-size-mb=10
 */
@Service
public class FileStorageService {

    private static final Set<String> ALLOWED_IMAGE_TYPES =
            Set.of("image/jpeg", "image/png", "image/webp", "image/gif");

    private static final Set<String> ALLOWED_CV_TYPES =
            Set.of("application/pdf",
                    "application/msword",
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document");

    @Value("${app.upload.profile-image-dir:uploads/profile-images}")
    private String profileImageDir;

    @Value("${app.upload.cv-dir:uploads/cvs}")
    private String cvDir;

    @Value("${app.upload.max-image-size-mb:5}")
    private long maxImageSizeMb;

    @Value("${app.upload.max-cv-size-mb:10}")
    private long maxCvSizeMb;

    // ── Profile images ────────────────────────────────────────────────────

    public String storeProfileImage(MultipartFile file) {
        validateFile(file, ALLOWED_IMAGE_TYPES, maxImageSizeMb,
                "Only JPEG, PNG, WebP, or GIF images are allowed");
        return store(file, profileImageDir);
    }

    public void deleteProfileImage(String relativePath) {
        if (relativePath != null) deleteFile(relativePath);
    }

    // ── CVs ──────────────────────────────────────────────────────────────

    public String storeCv(MultipartFile file) {
        validateFile(file, ALLOWED_CV_TYPES, maxCvSizeMb,
                "Only PDF or Word documents are allowed for CV");
        return store(file, cvDir);
    }

    public void deleteCv(String relativePath) {
        if (relativePath != null) deleteFile(relativePath);
    }

    // ── Internal helpers ─────────────────────────────────────────────────

    private String store(MultipartFile file, String dir) {
        try {
            Path directory = Paths.get(dir).toAbsolutePath().normalize();
            Files.createDirectories(directory);

            String originalName = file.getOriginalFilename();
            String extension = "";
            if (originalName != null && originalName.contains(".")) {
                extension = originalName.substring(originalName.lastIndexOf('.'));
            }

            String storedName = UUID.randomUUID() + extension;
            Path target = directory.resolve(storedName);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

            // Return a relative path so the app remains portable
            return dir + "/" + storedName;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file: " + e.getMessage(), e);
        }
    }

    private void deleteFile(String relativePath) {
        try {
            Path path = Paths.get(relativePath).toAbsolutePath().normalize();
            Files.deleteIfExists(path);
        } catch (IOException e) {
            // Log but don't propagate – stale file reference should not fail the request
            System.err.println("Warning: could not delete file " + relativePath + ": " + e.getMessage());
        }
    }

    private void validateFile(MultipartFile file, Set<String> allowedTypes,
                               long maxSizeMb, String typeErrorMsg) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("File must not be empty");
        }

        String contentType = file.getContentType();
        if (contentType == null || !allowedTypes.contains(contentType.toLowerCase())) {
            throw new BadRequestException(typeErrorMsg);
        }

        long maxBytes = maxSizeMb * 1024 * 1024;
        if (file.getSize() > maxBytes) {
            throw new BadRequestException("File exceeds the maximum allowed size of " + maxSizeMb + " MB");
        }
    }
}
