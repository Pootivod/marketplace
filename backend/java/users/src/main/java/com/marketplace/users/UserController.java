package com.marketplace.users;

import com.marketplace.users.dto.RegisterRequest;
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
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("register")
    public Mono<User> registers(@RequestBody RegisterRequest request) {
        return userService.register(request);
    }

    @PostMapping("login")
    public Mono<String> login(@RequestBody LoginRequest request) {
        return userService.login(request);
    }

}
