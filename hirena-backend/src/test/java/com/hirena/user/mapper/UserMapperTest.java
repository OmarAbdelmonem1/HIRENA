package com.hirena.user.mapper;

import com.hirena.user.dto.UserResponse;
import com.hirena.user.entity.Role;
import com.hirena.user.entity.User;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class UserMapperTest {

    private final UserMapper userMapper = new UserMapper();

    @Test
    void toResponse_shouldMapAllFieldsExceptPassword() {
        LocalDateTime now = LocalDateTime.now();
        User user = User.builder()
                .id(10L)
                .email("sara@hirena.com")
                .password("super_secret_hash")
                .role(Role.COMPANY)
                .enabled(true)
                .createdAt(now)
                .updatedAt(now)
                .build();

        UserResponse response = userMapper.toResponse(user);

        assertNotNull(response);
        assertEquals(10L, response.getId());

        assertEquals("sara@hirena.com", response.getEmail());

        assertEquals(Role.COMPANY, response.getRole());
        assertTrue(response.isEnabled());
        assertEquals(now, response.getCreatedAt());
        assertEquals(now, response.getUpdatedAt());
    }

    @Test
    void toResponse_shouldReturnNull_whenUserIsNull() {
        assertNull(userMapper.toResponse(null));
    }
}
