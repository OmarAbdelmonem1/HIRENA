package com.hirena.jobseeker.service;

import com.hirena.jobseeker.dto.CVResponse;
import com.hirena.jobseeker.entity.CV;
import com.hirena.jobseeker.entity.JobSeeker;
import com.hirena.jobseeker.exception.BadRequestException;
import com.hirena.jobseeker.exception.ResourceNotFoundException;
import com.hirena.jobseeker.repository.CVRepository;
import com.hirena.jobseeker.util.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
@Transactional
public class CVService {

    private final CVRepository cvRepository;
    private final JobSeekerService jobSeekerService;
    private final FileStorageService fileStorageService;

    @Transactional(readOnly = true)
    public CVResponse getMyCv() {
        JobSeeker jobSeeker = jobSeekerService.getJobSeekerForCurrentUser();
        CV cv = cvRepository.findByJobSeekerId(jobSeeker.getId())
                .orElseThrow(() -> new ResourceNotFoundException("No CV uploaded yet"));
        return CVResponse.fromEntity(cv);
    }

    public CVResponse uploadCv(MultipartFile file) {
        JobSeeker jobSeeker = jobSeekerService.getJobSeekerForCurrentUser();

        if (cvRepository.existsByJobSeekerId(jobSeeker.getId())) {
            throw new BadRequestException(
                    "A CV already exists. Use PUT /api/jobseeker/cv to replace it.");
        }

        String path = fileStorageService.storeCv(file);

        CV cv = CV.builder()
                .jobSeeker(jobSeeker)
                .fileName(file.getOriginalFilename())
                .filePath(path)
                .fileType(file.getContentType())
                .build();

        return CVResponse.fromEntity(cvRepository.save(cv));
    }

    public CVResponse replaceCv(MultipartFile file) {
        JobSeeker jobSeeker = jobSeekerService.getJobSeekerForCurrentUser();

        CV cv = cvRepository.findByJobSeekerId(jobSeeker.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No CV found to replace. Use POST /api/jobseeker/cv to upload one first."));

        // Delete old file from disk before storing the new one
        fileStorageService.deleteCv(cv.getFilePath());

        String newPath = fileStorageService.storeCv(file);

        cv.setFileName(file.getOriginalFilename());
        cv.setFilePath(newPath);
        cv.setFileType(file.getContentType());

        return CVResponse.fromEntity(cvRepository.save(cv));
    }

    public void deleteCv() {
        JobSeeker jobSeeker = jobSeekerService.getJobSeekerForCurrentUser();

        CV cv = cvRepository.findByJobSeekerId(jobSeeker.getId())
                .orElseThrow(() -> new ResourceNotFoundException("No CV found to delete"));

        fileStorageService.deleteCv(cv.getFilePath());
        cvRepository.delete(cv);
    }
}
