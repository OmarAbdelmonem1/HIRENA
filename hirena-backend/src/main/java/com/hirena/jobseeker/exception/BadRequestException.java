package com.hirena.jobseeker.exception;

/**
 * NOTE: If your project already has a shared BadRequestException, delete
 * this file and update the imports in the service classes accordingly.
 */
public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
        super(message);
    }
}
