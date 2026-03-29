package com.marketplace.users.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String login;
    private String encryptedPassword;
}
