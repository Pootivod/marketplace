package com.marketplace.usersapi;

import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/")
public class UsersApiController {

    @GetMapping("health")
    public Map<String, String> health() {
        return Map.of(
            "service", "users-api",
            "status", "ok"
        );
    }
}
