package com.marketplace.users.service;

import jakarta.ws.rs.core.Response;
import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.representations.AccessTokenResponse;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.util.List;
import java.util.UUID;

@Service
public class KeycloakService {
    private final String serverUrl;
    private final String adminRealm;
    private final String appRealm;
    private final String adminClientId;
    private final String userClientId;
    private final String userClientSecret;
    private final String adminUsername;
    private final String adminPassword;

    public KeycloakService(
        @Value("${app.keycloak.server-url}") String serverUrl,
        @Value("${app.keycloak.admin-realm}") String adminRealm,
        @Value("${app.keycloak.app-realm}") String appRealm,
        @Value("${app.keycloak.admin-client-id}") String adminClientId,
        @Value("${app.keycloak.user-client-id}") String userClientId,
        @Value("${app.keycloak.user-client-secret}") String userClientSecret,
        @Value("${app.keycloak.username}") String adminUsername,
        @Value("${app.keycloak.password}") String adminPassword) {
        this.serverUrl = serverUrl;
        this.adminRealm = adminRealm;
        this.appRealm = appRealm;
        this.adminClientId = adminClientId;
        this.userClientId = userClientId;
        this.userClientSecret = userClientSecret;
        this.adminUsername = adminUsername;
        this.adminPassword = adminPassword;
    }

    /**
     *
     * @param encryptedPassword
     * @return generatedUsername
     */
    public Mono<String> createUser(String encryptedPassword) {
        CredentialRepresentation credential = new CredentialRepresentation();
        credential.setType(CredentialRepresentation.PASSWORD);
        // TODO: Пароль нельзя отправлять с клиента в открытом виде.
        //  Нужно на стороне клиента шифровать открытым ключом а тут расшифровывать
        final String password = encryptedPassword;

        credential.setValue(password);
        credential.setTemporary(false);

        final String generatedUsername = UUID.randomUUID().toString();

        UserRepresentation user = new UserRepresentation();
        user.setUsername(generatedUsername);
        user.setCredentials(List.of(credential));
        user.setEnabled(true);

        return Mono.fromCallable(() -> {
            try (Response response = getAdminKeycloak().realm(appRealm).users().create(user)) {
                if (response.getStatus() != Response.Status.CREATED.getStatusCode()) {
                    throw new RuntimeException(
                        String.format("Keycloak error %d %s", response.getStatus(), response.readEntity(String.class))
                    );
                }
            }
            return generatedUsername;
        }).subscribeOn(Schedulers.boundedElastic());
    }

    /**
     *
     * @param keycloakUsername
     * @param encryptedPassword
     * @return JWT
     */
    public Mono<String> login(String keycloakUsername, String encryptedPassword) {
        return Mono.fromCallable(() -> getUserKeycloak(keycloakUsername, encryptedPassword).tokenManager().getAccessTokenString())
            .subscribeOn(Schedulers.boundedElastic());
    }

    private Keycloak getAdminKeycloak() {
        return KeycloakBuilder.builder()
            .serverUrl(serverUrl)
            .realm(adminRealm)
            .clientId(adminClientId)
            .username(adminUsername)
            .password(adminPassword)
            .build();
    }

    private Keycloak getUserKeycloak(String username, String encryptedPassword) {
        String password = encryptedPassword;

        return KeycloakBuilder.builder()
            .serverUrl(serverUrl)
            .realm(appRealm)
            .clientId(userClientId)
            .clientSecret(userClientSecret)
            .grantType(OAuth2Constants.PASSWORD)
            .username(username)
            .password(password)
            .build();
    }
}
