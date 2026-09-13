package com.hirena.cv.analysis.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hirena.cv.analysis.dto.CvScoreResponse;
import com.hirena.cv.analysis.exception.InvalidGeminiResponseException;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class GeminiResponseParserTest {
    private final GeminiResponseParser parser = new GeminiResponseParser(new ObjectMapper());

    @Test
    void parse_returnsTypedResponse() {
        CvScoreResponse result = parser.parse("""
                {"score":85,"matchedSkills":["Java"],"missingSkills":[],"experienceMatch":90,
                "matchedResponsibilities":["APIs"],"missingResponsibilities":[],"recommendations":[],
                "summary":"Strong match"}
                """);

        assertEquals(85, result.getScore());
        assertEquals("Strong match", result.getSummary());
    }

    @Test
    void parse_rejectsInvalidScore() {
        assertThrows(InvalidGeminiResponseException.class, () -> parser.parse("""
                {"score":101,"matchedSkills":[],"missingSkills":[],"experienceMatch":0,
                "matchedResponsibilities":[],"missingResponsibilities":[],"recommendations":[],"summary":"x"}
                """));
    }

    @Test
    void parse_rejectsInvalidJson() {
        assertThrows(InvalidGeminiResponseException.class, () -> parser.parse("{not-json}"));
    }
}
