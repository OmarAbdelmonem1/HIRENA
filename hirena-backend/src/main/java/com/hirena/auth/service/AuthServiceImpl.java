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
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

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
                .email(normalizedEmail)
                .password(passwordEncoder.encode(request.getPassword()))
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

        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            normalizedEmail,
                            request.getPassword()
                    )
            );
        } catch (org.springframework.security.authentication.DisabledException ex) {
            throw new AccountDisabledException("User account is disabled");
        } catch (org.springframework.security.authentication.BadCredentialsException ex) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        String token = jwtService.generateToken(
                userDetails,
                userDetails.getId(),
                userDetails.getRole()
        );

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .userId(userDetails.getId())
                .email(userDetails.getEmail())
                .role(userDetails.getRole())
                .build();
    }
}

