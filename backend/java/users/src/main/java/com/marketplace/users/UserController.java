package com.marketplace.users;

import com.marketplace.users.dto.CreateUserRequest;
import com.marketplace.users.dto.LoginRequest;
import com.marketplace.users.entity.User;
import com.marketplace.users.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping
    public Mono<User> createUser(@RequestBody CreateUserRequest request) {
        return userService.createUser(request);
    }

    @PostMapping("auth")
    public Mono<User> auth(LoginRequest request) {

    }

}
