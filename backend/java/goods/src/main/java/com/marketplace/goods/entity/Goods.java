package com.marketplace.goods.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Goods {

    @Id private long id;
    private String name;
    private Double price;
    // Field describing product
}
