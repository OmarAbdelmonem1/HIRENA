package com.hirena.cv.analysis.prompt;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertTrue;

class GeminiPromptBuilderTest {
    private final GeminiPromptBuilder builder = new GeminiPromptBuilder();

    @Test
    void build_includesInputsAndScoringRules() {
        String prompt = builder.build("Java Spring experience", "Need Java and Spring Boot");

        assertTrue(prompt.contains("Java Spring experience"));
        assertTrue(prompt.contains("Need Java and Spring Boot"));
        assertTrue(prompt.contains("Skills (40%)"));
        assertTrue(prompt.contains("Return ONLY valid JSON"));
    }
}
