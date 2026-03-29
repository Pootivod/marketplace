package com.marketplace.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
<<<<<<<< HEAD:backend/java/gateway/src/main/java/com/marketplace/gateway/GatewayApplication.java
public class GatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(GatewayApplication.class, args);
========
public class GatewayApiApplication {
    public static void main(String[] args) {
        SpringApplication.run(GatewayApiApplication.class, args);
>>>>>>>> adam:backend/java/gateway-api/src/main/java/com/marketplace/gateway/GatewayApiApplication.java
    }
}
