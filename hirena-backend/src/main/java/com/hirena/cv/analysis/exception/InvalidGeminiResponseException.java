package com.hirena.cv.analysis.exception;

public class InvalidGeminiResponseException extends CvAnalysisException {
    public InvalidGeminiResponseException(String message) {
        super(message);
    }

    public InvalidGeminiResponseException(String message, Throwable cause) {
        super(message, cause);
    }
}
