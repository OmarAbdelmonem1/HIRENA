package com.hirena.user.service;

import com.hirena.user.dto.UpdateUserRequest;
import com.hirena.user.dto.UserResponse;

public interface UserService {

    UserResponse getUserById(Long id);

    UserResponse getUserByEmail(String email);

    UserResponse getCurrentUser();

    UserResponse updateUser(Long id, UpdateUserRequest request);

    void deleteUser(Long id);
}
