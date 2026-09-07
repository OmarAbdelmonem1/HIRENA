package com.hirena.jobseeker.exception;

/**
 * Thrown when an authenticated JobSeeker tries to access/modify a
 * child resource (Education, WorkExperience, ...) that does not
 * belong to them. Mapped to 403 FORBIDDEN.
 *
 * NOTE: If your project already has an equivalent exception, delete
 * this file and reuse that one instead.
 */
public class ForbiddenOperationException extends RuntimeException {
    public ForbiddenOperationException(String message) {
        super(message);
    }
}
