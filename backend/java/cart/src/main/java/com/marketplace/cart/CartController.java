package com.marketplace.cart;

import com.marketplace.cart.dto.SaveCartRequest;
import com.marketplace.cart.entity.Cart;
import com.marketplace.cart.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/public/v1/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping("{userId}")
    public Mono<Cart> getByUserId(@PathVariable String userId) {
        return cartService.getByUserId(userId);
    }

    @PostMapping
    public Mono<Cart> save(@RequestBody SaveCartRequest request) {
        return cartService.save(request);
    }
}
