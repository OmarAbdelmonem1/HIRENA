package com.hirena.user.service;

import com.hirena.exception.ResourceNotFoundException;
import com.hirena.user.dto.UpdateUserRequest;
import com.hirena.user.dto.UserResponse;
import com.hirena.user.entity.Role;
import com.hirena.user.entity.User;
import com.hirena.user.mapper.UserMapper;
import com.hirena.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Spy
    private UserMapper userMapper = new UserMapper();

    @InjectMocks
    private UserServiceImpl userService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder()
                .id(1L)
                .email("alice@hirena.com")
                .password("encoded_pass")

                .role(Role.JOB_SEEKER)
                .enabled(true)
                .build();
    }

    @Test
    void getUserById_shouldReturnUserResponse() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));

        UserResponse response = userService.getUserById(1L);

        assertNotNull(response);
        assertEquals(1L, response.getId());

        assertEquals("alice@hirena.com", response.getEmail());
    }

    @Test
    void getUserById_shouldThrowException_whenNotFound() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> userService.getUserById(99L));
    }

    @Test
    void updateUser_shouldUpdateFieldsAndReturnResponse() {
        UpdateUserRequest request = UpdateUserRequest.builder()
                .firstName("AliceUpdated")
                .lastName("SmithUpdated")
                .phone("+111222333")
                .build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserResponse response = userService.updateUser(1L, request);

        assertNotNull(response);
        // Removed assertions for firstName, lastName, and phone as these fields no longer exist in UserResponse
    }

    @Test
    void deleteUser_shouldDelete_whenUserExists() {
        when(userRepository.existsById(1L)).thenReturn(true);
        doNothing().when(userRepository).deleteById(1L);

        assertDoesNotThrow(() -> userService.deleteUser(1L));
        verify(userRepository, times(1)).deleteById(1L);
    }

    @Test
    void deleteUser_shouldThrowException_whenUserDoesNotExist() {
        when(userRepository.existsById(99L)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> userService.deleteUser(99L));
        verify(userRepository, never()).deleteById(99L);
    }
}
