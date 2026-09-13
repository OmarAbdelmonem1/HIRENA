package com.hirena.cv.analysis.service;

import com.hirena.cv.analysis.dto.CvScoreResponse;
import com.hirena.cv.analysis.extractor.CvTextExtractor;
import com.hirena.cv.analysis.prompt.GeminiPromptBuilder;
import com.hirena.jobseeker.util.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class CvAnalysisService {
    private final CvTextExtractor cvTextExtractor;
    private final GeminiPromptBuilder promptBuilder;
    private final GeminiService geminiService;
    private final GeminiResponseParser responseParser;
    private final FileStorageService fileStorageService;

    @Autowired
    public CvAnalysisService(CvTextExtractor cvTextExtractor,
                             GeminiPromptBuilder promptBuilder,
                             GeminiService geminiService,
                             GeminiResponseParser responseParser,
                             FileStorageService fileStorageService) {
        this.cvTextExtractor = cvTextExtractor;
        this.promptBuilder = promptBuilder;
        this.geminiService = geminiService;
        this.responseParser = responseParser;
        this.fileStorageService = fileStorageService;
    }

    public CvAnalysisService(CvTextExtractor cvTextExtractor,
                             GeminiPromptBuilder promptBuilder,
                             GeminiService geminiService,
                             GeminiResponseParser responseParser) {
        this(cvTextExtractor, promptBuilder, geminiService, responseParser, null);
    }

    public CvScoreResponse analyze(MultipartFile cvFile, String jobDescription) {
        if (jobDescription == null || jobDescription.isBlank()) {
            throw new IllegalArgumentException("Job description must not be empty");
        }
        String cvText = cvTextExtractor.extract(cvFile);
        String prompt = promptBuilder.build(cvText, jobDescription.trim());
        return responseParser.parse(geminiService.generate(prompt));
    }

    public CvScoreResponse analyzeStoredCv(String filePath, String fileName, String fileType,
                                           String jobDescription) {
        if (jobDescription == null || jobDescription.isBlank()) {
            throw new IllegalArgumentException("Job description must not be empty");
        }
        if (fileStorageService == null) {
            throw new IllegalStateException("Stored CV analysis is not configured");
        }
        byte[] cvBytes = fileStorageService.readFile(filePath);
        String cvText = cvTextExtractor.extract(cvBytes, fileName, fileType);
        String prompt = promptBuilder.build(cvText, jobDescription.trim());
        return responseParser.parse(geminiService.generate(prompt));
    }
}
