package com.marketplace.users.controller;

import com.marketplace.users.dto.UpdateUserProfileRequest;
import com.marketplace.users.dto.UserProfileResponse;
import com.marketplace.users.model.UserProfile;
import com.marketplace.users.service.UserProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserProfileService service;

    @GetMapping("/me")
    public UserProfileResponse me(@AuthenticationPrincipal Jwt jwt) {
        return toResponse(service.getOrCreateFromJwt(jwt));
    }

    @PutMapping("/me")
    public UserProfileResponse updateMe(@AuthenticationPrincipal Jwt jwt,
                                        @Valid @RequestBody UpdateUserProfileRequest request) {
        return toResponse(service.updateCurrent(jwt, request));
    }

    private UserProfileResponse toResponse(UserProfile profile) {
        return new UserProfileResponse(
                profile.getId(),
                profile.getSubject(),
                profile.getEmail(),
                profile.getUsername(),
                profile.getFirstName(),
                profile.getLastName()
        );
    }
}
