package com.marketplace.users.service;

import com.marketplace.users.dto.AuthResponse;
import com.marketplace.users.dto.RegisterRequest;
import com.marketplace.users.dto.LoginRequest;
import com.marketplace.users.entity.User;
import com.marketplace.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.r2dbc.core.R2dbcEntityTemplate;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
// TODO: Авторизация через сторонние API, tokenExchange в keycloak
//  Также сделать create/login напрямую в keycloak с фронта
public class UserService {

    private final UserRepository userRepository;
    private final KeycloakService keycloakService;
    private final R2dbcEntityTemplate r2dbcEntityTemplate;

    public Mono<AuthResponse> register(RegisterRequest request) {
        return findUserByLogin(request.getLogin())
            .flatMap(existingUser -> Mono.<AuthResponse>error(new IllegalArgumentException("User already exists")))
            .switchIfEmpty(
                keycloakService.createUser(request.getEncryptedPassword())
                    .flatMap(keycloakUsername -> saveCreatedToRepository(keycloakUsername, request)
                        .then(keycloakService.login(keycloakUsername, request.getEncryptedPassword()))
                        .map(jwt -> buildAuthResponse(jwt, request.getFirstName(), request.getLastName())))
            );
    }

    public Mono<AuthResponse> login(LoginRequest request) {
        String login = request.getLogin();

        if (login == null || login.isBlank()) {
            return Mono.error(new IllegalArgumentException("Empty login"));
        }

        return findUserByLogin(login)
            .switchIfEmpty(Mono.error(new IllegalArgumentException("User not found")))
            .flatMap(user -> keycloakService.login(user.getId(), request.getEncryptedPassword())
                .map(jwt -> buildAuthResponse(jwt, user.getFirstName(), user.getLastName())));
    }

    private Mono<User> saveCreatedToRepository(String keycloakUsername, RegisterRequest request) {
        User user = new User();
        user.setId(keycloakUsername);

        if (request.getLogin().contains("@")) {
            user.setEmail(request.getLogin());
        }
        else {
            user.setPhone(request.getLogin());
        }

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());

        return r2dbcEntityTemplate.insert(User.class).using(user);
    }

    private Mono<User> findUserByLogin(String login) {
        return login.contains("@") ? userRepository.findByEmail(login) : userRepository.findByPhone(login);
    }

    // TODO: Заменить на mapstruct
    private AuthResponse buildAuthResponse(String jwt, String firstName, String lastName) {
        AuthResponse authResponse = new AuthResponse();
        authResponse.setJwt(jwt);
        authResponse.setFirstName(firstName);
        authResponse.setLastName(lastName);
        return authResponse;
    }
}
