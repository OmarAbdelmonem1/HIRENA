package com.hirena.auth.service;

import com.hirena.auth.dto.AuthResponse;
import com.hirena.auth.dto.LoginRequest;
import com.hirena.auth.dto.RegisterRequest;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}
