package com.hirena.auth.service;

import com.hirena.auth.dto.AuthResponse;
import com.hirena.auth.dto.LoginRequest;
import com.hirena.auth.dto.RegisterRequest;
import com.hirena.auth.security.CustomUserDetails;
import com.hirena.auth.security.JwtService;
import com.hirena.exception.AccountDisabledException;
import com.hirena.exception.BadRequestException;
import com.hirena.exception.EmailAlreadyExistsException;
import com.hirena.exception.InvalidCredentialsException;
import com.hirena.user.entity.Role;
import com.hirena.user.entity.User;
import com.hirena.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (request.getRole() == Role.ADMIN) {
            throw new BadRequestException("Registration as ADMIN is not permitted");
        }

        String normalizedEmail = request.getEmail().toLowerCase().trim();

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new EmailAlreadyExistsException("Email is already registered: " + request.getEmail());
        }

        User user = User.builder()
                .firstName(request.getFirstName().trim())
                .lastName(request.getLastName().trim())
                .email(normalizedEmail)
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone() != null ? request.getPhone().trim() : null)
                .role(request.getRole())
                .enabled(true)
                .build();

        User savedUser = userRepository.save(user);

        CustomUserDetails userDetails = new CustomUserDetails(savedUser);
        String token = jwtService.generateToken(userDetails, savedUser.getId(), savedUser.getRole());

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .userId(savedUser.getId())
                .email(savedUser.getEmail())
                .role(savedUser.getRole())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String normalizedEmail = request.getEmail().toLowerCase().trim();

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        if (!user.isEnabled()) {
            throw new AccountDisabledException("User account is disabled. Please contact support.");
        }

        CustomUserDetails userDetails = new CustomUserDetails(user);
        String token = jwtService.generateToken(userDetails, user.getId(), user.getRole());

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .userId(user.getId())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}
