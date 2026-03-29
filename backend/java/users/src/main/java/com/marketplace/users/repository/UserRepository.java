package com.marketplace.users.repository;

import com.marketplace.users.entity.User;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;

import reactor.core.publisher.Mono;

public interface UserRepository extends ReactiveCrudRepository<User, String> {
    Mono<String> findIdByEmail(String email);
    Mono<String> findIdByPhone(String email);
}
