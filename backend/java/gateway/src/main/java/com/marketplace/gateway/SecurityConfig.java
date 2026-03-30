package com.marketplace.gateway;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

//@Configuration
public class SecurityConfig {

//    @Order(Ordered.HIGHEST_PRECEDENCE)
//    @Bean
//    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
//        http
//            .csrf(ServerHttpSecurity.CsrfSpec::disable)
//            .authorizeExchange(exchanges -> exchanges
//                .anyExchange().authenticated()
//            )
//
//            .oauth2ResourceServer(oauth2 -> oauth2
//                .jwt(Customizer.withDefaults())
//            );
//
//        return http.build();
//    }
}
