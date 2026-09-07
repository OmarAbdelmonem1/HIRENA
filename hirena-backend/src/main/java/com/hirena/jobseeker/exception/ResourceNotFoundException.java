package com.hirena.jobseeker.exception;

/**
 * NOTE: If your project already has a global ResourceNotFoundException
 * (e.g. in a shared/common package), delete this file and update the
 * imports in the service classes to point to the existing one instead.
 */
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
