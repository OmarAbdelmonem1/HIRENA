package com.hirena.application.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hirena.application.entity.Application;
import com.hirena.application.entity.CvAnalysis;
import com.hirena.application.entity.CvAnalysisStatus;
import com.hirena.application.repository.ApplicationRepository;
import com.hirena.cv.analysis.dto.CvScoreResponse;
import com.hirena.cv.analysis.exception.CvAnalysisException;
import com.hirena.cv.analysis.service.CvAnalysisService;
import com.hirena.exception.ResourceNotFoundException;
import com.hirena.job.entity.Job;
import com.hirena.jobseeker.entity.CV;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ApplicationCvAnalysisAsyncService {
    private final ApplicationRepository applicationRepository;
    private final CvAnalysisService cvAnalysisService;
    private final ObjectMapper objectMapper;

    @Async
    @Transactional
    public void analyze(Long applicationId) {
        Application application = applicationRepository.findById(applicationId).orElse(null);
        if (application == null) {
            log.warn("Cannot analyze missing application {}", applicationId);
            return;
        }

        CvAnalysis analysisResult = application.getCvAnalysis();
        if (analysisResult == null) {
            analysisResult = CvAnalysis.builder()
                    .application(application)
                    .status(CvAnalysisStatus.ANALYZING)
                    .build();
            application.setCvAnalysis(analysisResult);
        }

        CV cv = application.getJobSeeker().getCv();
        if (cv == null) {
            analysisResult.setStatus(CvAnalysisStatus.NOT_ANALYZED);
            analysisResult.setError("No CV is uploaded for this candidate");
            return;
        }

        try {
            CvScoreResponse analysis = cvAnalysisService.analyzeStoredCv(
                    cv.getFilePath(), cv.getFileName(), cv.getFileType(),
                    buildJobDescription(application.getJob()));
            analysisResult.setStatus(CvAnalysisStatus.COMPLETED);
            analysisResult.setScore(analysis.getScore());
            analysisResult.setExperienceMatch(analysis.getExperienceMatch());
            analysisResult.setMatchedSkills(writeList(analysis.getMatchedSkills()));
            analysisResult.setMissingSkills(writeList(analysis.getMissingSkills()));
            analysisResult.setMatchedResponsibilities(writeList(analysis.getMatchedResponsibilities()));
            analysisResult.setMissingResponsibilities(writeList(analysis.getMissingResponsibilities()));
            analysisResult.setRecommendations(writeList(analysis.getRecommendations()));
            analysisResult.setSummary(analysis.getSummary());
            analysisResult.setError(null);
            analysisResult.setAnalyzedAt(LocalDateTime.now());
        } catch (CvAnalysisException | IllegalArgumentException | ResourceNotFoundException e) {
            log.warn("CV analysis failed for application {}: {}", applicationId, e.getMessage(), e);
            analysisResult.setStatus(CvAnalysisStatus.FAILED);
            analysisResult.setError(e.getMessage());
        }
        applicationRepository.save(application);
    }

    private String buildJobDescription(Job job) {
        return "Title: " + job.getTitle()
                + "\nDescription: " + nullToEmpty(job.getDescription())
                + "\nRequirements: " + nullToEmpty(job.getRequirements())
                + "\nRequired years of experience: "
                + (job.getExperienceRequired() == null ? "Not specified" : job.getExperienceRequired());
    }

    private String nullToEmpty(String value) {
        return value == null ? "" : value;
    }

    private String writeList(List<String> values) {
        try {
            return objectMapper.writeValueAsString(values == null ? List.of() : values);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Could not store CV analysis details", e);
        }
    }
}
