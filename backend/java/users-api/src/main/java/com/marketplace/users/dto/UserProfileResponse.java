package com.marketplace.users.dto;

public record UserProfileResponse(
        Long id,
        String subject,
        String email,
        String username,
        String firstName,
        String lastName
) {
}
