package com.marketplace.users.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UpdateUserProfileRequest(
        @Email @NotBlank String email,
        String username,
        String firstName,
        String lastName
) {
}
