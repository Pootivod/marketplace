package com.marketplace.users.service;

import com.marketplace.users.dto.RegisterRequest;
import com.marketplace.users.dto.LoginRequest;
import com.marketplace.users.entity.User;
import com.marketplace.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.r2dbc.core.R2dbcEntityTemplate;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

@Service
@RequiredArgsConstructor
// TODO: Авторизация через сторонние API, tokenExchange в keycloak
//  Также сделать create/login напрямую в keycloak с фронта
public class UserService {

    private final UserRepository userRepository;
    private final KeycloakService keycloakService;
    private final R2dbcEntityTemplate r2dbcEntityTemplate;

    public Mono<User> register(RegisterRequest request) {
        return findKeycloakUsernameByLogin(request.getLogin())
            .flatMap(existingUser -> Mono.<User>error(new IllegalArgumentException("User already exists")))
            .switchIfEmpty(
                Mono.fromCallable(() -> keycloakService.createUser(request.getEncryptedPassword()))
                    .subscribeOn(Schedulers.boundedElastic())
                    .flatMap(keycloakUsername -> saveCreatedUser(keycloakUsername, request))
            );
    }

    public Mono<String> login(LoginRequest request) {
        String login = request.getLogin();

        if (login == null || login.isBlank()) {
            return Mono.error(new IllegalArgumentException("Empty login"));
        }

        return findKeycloakUsernameByLogin(login)
            .flatMap(keycloakUsername -> Mono.fromCallable(
                () -> keycloakService.login(keycloakUsername, request.getEncryptedPassword())
            ).subscribeOn(Schedulers.boundedElastic()));
    }

    private Mono<User> saveCreatedUser(String keycloakUsername, RegisterRequest request) {
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

    private Mono<String> findKeycloakUsernameByLogin(String login) {
//        TODO: Улучшить
        return login.contains("@") ? userRepository.findIdByEmail(login) : userRepository.findIdByPhone(login);
    }
}
