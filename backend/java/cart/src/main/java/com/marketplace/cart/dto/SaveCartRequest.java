package com.marketplace.cart.dto;

import com.marketplace.cart.entity.CartItem;
import lombok.Data;

import java.util.List;

@Data
public class SaveCartRequest {
    private String userId;
    private List<CartItem> items;
}
