package com.hirena.auth.security;

import com.hirena.user.entity.Role;
import com.hirena.user.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "secretKey", "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970");
        ReflectionTestUtils.setField(jwtService, "jwtExpiration", 86400000L);
    }

    @Test
    void generateToken_and_extractUsername_shouldWorkCorrectly() {
        User user = User.builder()
                .id(1L)
                .email("test@hirena.com")
                .password("encoded_pass")
                .role(Role.JOB_SEEKER)
                .enabled(true)
                .build();

        CustomUserDetails userDetails = new CustomUserDetails(user);

        String token = jwtService.generateToken(userDetails, user.getId(), user.getRole());

        assertNotNull(token);
        assertEquals("test@hirena.com", jwtService.extractUsername(token));
        assertTrue(jwtService.isTokenValid(token, userDetails));
    }

    @Test
    void isTokenValid_shouldReturnFalse_forDifferentUser() {
        User user1 = User.builder()
                .id(1L)
                .email("user1@hirena.com")
                .password("encoded_pass")
                .role(Role.COMPANY)
                .enabled(true)
                .build();

        User user2 = User.builder()
                .id(2L)
                .email("user2@hirena.com")
                .password("encoded_pass")
                .role(Role.JOB_SEEKER)
                .enabled(true)
                .build();

        CustomUserDetails userDetails1 = new CustomUserDetails(user1);
        CustomUserDetails userDetails2 = new CustomUserDetails(user2);

        String token1 = jwtService.generateToken(userDetails1, user1.getId(), user1.getRole());

        assertFalse(jwtService.isTokenValid(token1, userDetails2));
    }
}
