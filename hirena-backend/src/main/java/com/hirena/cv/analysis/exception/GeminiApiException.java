package com.hirena.cv.analysis.exception;

import org.springframework.http.HttpStatusCode;

public class GeminiApiException extends CvAnalysisException {
    private final HttpStatusCode status;

    public GeminiApiException(String message) {
        super(message);
        this.status = null;
    }

    public GeminiApiException(String message, HttpStatusCode status) {
        super(message);
        this.status = status;
    }

    public GeminiApiException(String message, Throwable cause) {
        super(message, cause);
        this.status = null;
    }

    public HttpStatusCode getStatus() {
        return status;
    }
}
