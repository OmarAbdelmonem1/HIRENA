package com.hirena.cv.analysis.exception;

public class CvAnalysisException extends RuntimeException {
    public CvAnalysisException(String message) {
        super(message);
    }

    public CvAnalysisException(String message, Throwable cause) {
        super(message, cause);
    }
}
