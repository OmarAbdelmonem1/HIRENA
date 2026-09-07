package com.hirena.auth.security;

import com.hirena.user.entity.User;
import com.hirena.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

/**
 * Single point of truth for resolving the currently authenticated User.
 * Extracts user identity securely from the SecurityContext populated by the JWT filter.
 */
@Component
@RequiredArgsConstructor
public class CurrentUserProvider {

    private final UserRepository userRepository;

    public User getCurrentUser() {
        CustomUserDetails principal = resolvePrincipal();
        String email = principal.getUsername();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException(
                        "Authenticated principal not found in database: " + email));
    }

    public Long getCurrentUserId() {
        return resolvePrincipal().getId();
    }

    public String getCurrentUserEmail() {
        return resolvePrincipal().getUsername();
    }

    private CustomUserDetails resolvePrincipal() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()
                || "anonymousUser".equals(auth.getPrincipal())) {
            throw new IllegalStateException("No authenticated user in SecurityContext");
        }
        if (auth.getPrincipal() instanceof CustomUserDetails details) {
            return details;
        }
        throw new IllegalStateException(
                "Unexpected principal type: " + auth.getPrincipal().getClass().getName());
    }
}
