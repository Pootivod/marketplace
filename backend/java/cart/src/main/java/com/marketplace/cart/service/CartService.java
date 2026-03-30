package com.marketplace.cart.service;

import com.marketplace.cart.dto.SaveCartRequest;
import com.marketplace.cart.entity.Cart;
import com.marketplace.cart.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class CartService {
    private final CartRepository cartRepository;

    public Mono<Cart> getByUserId(String userId) {
        return cartRepository.findById(userId)
                .defaultIfEmpty(new Cart(userId, new ArrayList<>()));
    }

    public Mono<Cart> save(SaveCartRequest request) {
        Cart cart = new Cart(
                request.getUserId(),
                request.getItems() == null ? new ArrayList<>() : request.getItems()
        );

        return cartRepository.save(cart);
    }
}
