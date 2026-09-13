package com.hirena.jobseeker.util;

import com.hirena.jobseeker.exception.BadRequestException;
import com.hirena.exception.ResourceNotFoundException;
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
 *   app.upload.max-cv-size-mb=3
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

    @Value("${app.upload.company-logo-dir:uploads/company-logos}")
    private String companyLogoDir;

    @Value("${app.upload.cv-dir:uploads/cvs}")
    private String cvDir;

    @Value("${app.upload.max-image-size-mb:5}")
    private long maxImageSizeMb;

    @Value("${app.upload.max-cv-size-mb:3}")
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

    public String storeCompanyLogo(MultipartFile file) {
        validateFile(file, ALLOWED_IMAGE_TYPES, maxImageSizeMb,
                "Only JPEG, PNG, WebP, or GIF images are allowed");
        return store(file, companyLogoDir);
    }

    public String storeExternalCompanyLogo(byte[] content, String contentType) {
        if (content == null || content.length == 0) {
            throw new BadRequestException("Downloaded company logo is empty");
        }
        if (contentType == null || !ALLOWED_IMAGE_TYPES.contains(contentType.toLowerCase())) {
            throw new BadRequestException("Downloaded company logo is not a supported image");
        }
        long maxBytes = maxImageSizeMb * 1024 * 1024;
        if (content.length > maxBytes) {
            throw new BadRequestException("Downloaded company logo exceeds the maximum allowed size");
        }

        String extension = switch (contentType.toLowerCase()) {
            case "image/jpeg" -> ".jpg";
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            case "image/gif" -> ".gif";
            default -> throw new BadRequestException("Downloaded company logo is not a supported image");
        };

        try {
            Path directory = Paths.get(companyLogoDir).toAbsolutePath().normalize();
            Files.createDirectories(directory);
            Path target = directory.resolve(UUID.randomUUID() + extension);
            Files.write(target, content);
            return companyLogoDir + "/" + target.getFileName();
        } catch (IOException e) {
            throw new RuntimeException("Failed to store downloaded company logo", e);
        }
    }

    public void deleteCompanyLogo(String relativePath) {
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

    public byte[] readFile(String relativePath) {
        try {
            return Files.readAllBytes(Paths.get(relativePath).toAbsolutePath().normalize());
        } catch (IOException e) {
            throw new ResourceNotFoundException("Uploaded file is no longer available");
        }
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
