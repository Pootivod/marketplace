package com.marketplace.users.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String login;
    private String encryptedPassword;

    private String firstName;
    private String lastName;
}
