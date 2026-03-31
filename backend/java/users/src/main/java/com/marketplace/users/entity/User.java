package com.marketplace.users.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Table("users")
public class User {
    @Id private String id;
    private String firstName;
    private String lastName;

    private String email;
    private String phone;
}
