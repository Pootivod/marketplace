package com.marketplace.users.service;

import com.marketplace.users.dto.UpdateUserProfileRequest;
import com.marketplace.users.model.UserProfile;
import com.marketplace.users.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserProfileService {

    private final UserProfileRepository repository;

    @Transactional
    public UserProfile getOrCreateFromJwt(Jwt jwt) {
        String subject = jwt.getSubject();
        return repository.findBySubject(subject)
                .orElseGet(() -> repository.save(UserProfile.builder()
                        .subject(subject)
                        .email(getClaim(jwt, "email", "unknown@example.com"))
                        .username(getClaim(jwt, "preferred_username", null))
                        .firstName(getClaim(jwt, "given_name", null))
                        .lastName(getClaim(jwt, "family_name", null))
                        .build()));
    }

    @Transactional
    public UserProfile updateCurrent(Jwt jwt, UpdateUserProfileRequest request) {
        UserProfile profile = getOrCreateFromJwt(jwt);
        profile.setEmail(request.email());
        profile.setUsername(request.username());
        profile.setFirstName(request.firstName());
        profile.setLastName(request.lastName());
        return repository.save(profile);
    }

    private String getClaim(Jwt jwt, String name, String defaultValue) {
        Object value = jwt.getClaims().get(name);
        return value == null ? defaultValue : String.valueOf(value);
    }
}
