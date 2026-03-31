package com.marketplace.users.dto;

import lombok.Data;

@Data
public class AuthResponse {
    private String firstName;
    private String lastName;
    private String jwt;
}
