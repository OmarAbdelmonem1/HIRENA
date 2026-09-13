package com.hirena.cv.analysis.service;

import com.hirena.cv.analysis.dto.CvScoreResponse;
import com.hirena.cv.analysis.extractor.CvTextExtractor;
import com.hirena.cv.analysis.prompt.GeminiPromptBuilder;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.mock.web.MockMultipartFile;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

class CvAnalysisServiceTest {
    @Test
    void analyze_coordinatesExtractionPromptGeminiAndParsing() {
        CvTextExtractor extractor = Mockito.mock(CvTextExtractor.class);
        GeminiPromptBuilder promptBuilder = Mockito.mock(GeminiPromptBuilder.class);
        GeminiService geminiService = Mockito.mock(GeminiService.class);
        GeminiResponseParser parser = Mockito.mock(GeminiResponseParser.class);
        CvAnalysisService service = new CvAnalysisService(extractor, promptBuilder, geminiService, parser);

        when(extractor.extract(Mockito.any())).thenReturn("candidate text");
        when(promptBuilder.build("candidate text", "job text")).thenReturn("prompt");
        when(geminiService.generate("prompt")).thenReturn("json");
        CvScoreResponse expected = CvScoreResponse.builder().score(80).summary("Good").build();
        when(parser.parse("json")).thenReturn(expected);

        CvScoreResponse result = service.analyze(
                new MockMultipartFile("cv", "candidate.pdf", "application/pdf", new byte[]{1}),
                "job text");

        assertEquals(80, result.getScore());
    }
}
