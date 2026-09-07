package com.hirena.auth.service;

import com.hirena.auth.dto.AuthResponse;
import com.hirena.auth.dto.LoginRequest;
import com.hirena.auth.dto.RegisterRequest;
import com.hirena.auth.security.JwtService;
import com.hirena.exception.AccountDisabledException;
import com.hirena.exception.BadRequestException;
import com.hirena.exception.EmailAlreadyExistsException;
import com.hirena.exception.InvalidCredentialsException;
import com.hirena.user.entity.Role;
import com.hirena.user.entity.User;
import com.hirena.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthServiceImpl authService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@hirena.com")
                .password("encoded_password")
                .phone("+123456789")
                .role(Role.JOB_SEEKER)
                .enabled(true)
                .build();
    }

    @Test
    void register_shouldSucceed_forJobSeeker() {
        RegisterRequest request = RegisterRequest.builder()
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@hirena.com")
                .password("password123")
                .phone("+123456789")
                .role(Role.JOB_SEEKER)
                .build();

        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encoded_password");
        when(userRepository.save(any(User.class))).thenReturn(sampleUser);
        when(jwtService.generateToken(any(), eq(1L), eq(Role.JOB_SEEKER))).thenReturn("mocked-jwt-token");

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("mocked-jwt-token", response.getToken());
        assertEquals("Bearer", response.getTokenType());
        assertEquals(1L, response.getUserId());
        assertEquals("john.doe@hirena.com", response.getEmail());
        assertEquals(Role.JOB_SEEKER, response.getRole());

        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void register_shouldThrowBadRequestException_whenRoleIsAdmin() {
        RegisterRequest request = RegisterRequest.builder()
                .firstName("Admin")
                .lastName("User")
                .email("admin@hirena.com")
                .password("admin123")
                .role(Role.ADMIN)
                .build();

        assertThrows(BadRequestException.class, () -> authService.register(request));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void register_shouldThrowEmailAlreadyExistsException_whenEmailTaken() {
        RegisterRequest request = RegisterRequest.builder()
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@hirena.com")
                .password("password123")
                .role(Role.JOB_SEEKER)
                .build();

        when(userRepository.existsByEmail("john.doe@hirena.com")).thenReturn(true);

        assertThrows(EmailAlreadyExistsException.class, () -> authService.register(request));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void login_shouldSucceed_withValidCredentials() {
        LoginRequest request = LoginRequest.builder()
                .email("john.doe@hirena.com")
                .password("password123")
                .build();

        when(userRepository.findByEmail("john.doe@hirena.com")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("password123", "encoded_password")).thenReturn(true);
        when(jwtService.generateToken(any(), eq(1L), eq(Role.JOB_SEEKER))).thenReturn("mocked-jwt-token");

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("mocked-jwt-token", response.getToken());
        assertEquals(1L, response.getUserId());
        assertEquals("john.doe@hirena.com", response.getEmail());
        assertEquals(Role.JOB_SEEKER, response.getRole());
    }

    @Test
    void login_shouldThrowInvalidCredentials_whenEmailNotFound() {
        LoginRequest request = LoginRequest.builder()
                .email("unknown@hirena.com")
                .password("password123")
                .build();

        when(userRepository.findByEmail("unknown@hirena.com")).thenReturn(Optional.empty());

        assertThrows(InvalidCredentialsException.class, () -> authService.login(request));
    }

    @Test
    void login_shouldThrowInvalidCredentials_whenPasswordIncorrect() {
        LoginRequest request = LoginRequest.builder()
                .email("john.doe@hirena.com")
                .password("wrongpassword")
                .build();

        when(userRepository.findByEmail("john.doe@hirena.com")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("wrongpassword", "encoded_password")).thenReturn(false);

        assertThrows(InvalidCredentialsException.class, () -> authService.login(request));
    }

    @Test
    void login_shouldThrowAccountDisabledException_whenUserIsDisabled() {
        sampleUser.setEnabled(false);

        LoginRequest request = LoginRequest.builder()
                .email("john.doe@hirena.com")
                .password("password123")
                .build();

        when(userRepository.findByEmail("john.doe@hirena.com")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("password123", "encoded_password")).thenReturn(true);

        assertThrows(AccountDisabledException.class, () -> authService.login(request));
    }
}
