package com.marketplace.gateway;


import org.springframework.boot.security.autoconfigure.actuate.web.reactive.EndpointRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.util.matcher.OrServerWebExchangeMatcher;
import org.springframework.security.web.server.util.matcher.ServerWebExchangeMatchers;

/**
 * Зависимость на либу нужна чтобы переиспользовать некоторые настройки.
 * При расширении логики - убрать
 */
@Configuration
public class SecurityConfig extends com.marketplace.common.starter.SecurityConfig {

    @Override
    @Bean
    @Order(1)
    public SecurityWebFilterChain publicChain(ServerHttpSecurity http) {
        return applyCommon(http)
            .securityMatcher(new OrServerWebExchangeMatcher(
                // Отличие в /*/api. Сюда приходит до локатора
                ServerWebExchangeMatchers.pathMatchers("/*/api/public/**"),
                EndpointRequest.toAnyEndpoint())
            )
            .authorizeExchange(ex -> ex.anyExchange().permitAll())
            .build();
    }
}
