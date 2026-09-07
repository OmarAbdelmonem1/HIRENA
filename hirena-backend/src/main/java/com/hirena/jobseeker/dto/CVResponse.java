package com.hirena.jobseeker.dto;

import com.hirena.jobseeker.entity.CV;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CVResponse {

    private Long id;
    private String fileName;
    private String fileType;
    private LocalDateTime uploadedAt;
    private LocalDateTime updatedAt;

    // filePath is intentionally excluded – clients should not know the server path

    public static CVResponse fromEntity(CV cv) {
        return CVResponse.builder()
                .id(cv.getId())
                .fileName(cv.getFileName())
                .fileType(cv.getFileType())
                .uploadedAt(cv.getUploadedAt())
                .updatedAt(cv.getUpdatedAt())
                .build();
    }
}
