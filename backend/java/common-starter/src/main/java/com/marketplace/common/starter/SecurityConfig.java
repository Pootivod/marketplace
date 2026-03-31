package com.marketplace.common.starter;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.security.autoconfigure.actuate.web.reactive.EndpointRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.core.env.Environment;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableReactiveMethodSecurity;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.oauth2.jwt.NimbusReactiveJwtDecoder;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;
import org.springframework.security.oauth2.server.resource.web.reactive.function.client.ServerBearerExchangeFilterFunction;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.util.matcher.OrServerWebExchangeMatcher;
import org.springframework.security.web.server.util.matcher.ServerWebExchangeMatchers;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
@ConditionalOnProperty(prefix = "app.common-starter.security", name = "enabled", havingValue = "true", matchIfMissing = true)
@EnableWebFluxSecurity
@EnableReactiveMethodSecurity
public class SecurityConfig {

    @Bean
    @ConditionalOnMissingBean(ReactiveJwtDecoder.class)
    public ReactiveJwtDecoder reactiveJwtDecoder(Environment environment) {
        return NimbusReactiveJwtDecoder.withIssuerLocation(
            environment.resolvePlaceholders("${KEYCLOAK_ADDR}/realms/${KEYCLOAK_REALM}")
        ).build();
    }

    @Bean
    @Order(1)
    public SecurityWebFilterChain publicChain(ServerHttpSecurity http) {
        return applyCommon(http)
            .securityMatcher(new OrServerWebExchangeMatcher(
                ServerWebExchangeMatchers.pathMatchers("/api/public/**"),
                // Зависимость на инфраструктуру - actuator сидит на закрытом 9000
                // TODO: Мб поменять, сделать доступ для админ аккаунта k8s
                EndpointRequest.toAnyEndpoint())
            )
            .authorizeExchange(ex -> ex.anyExchange().permitAll())
            .build();
    }

    @Bean
    @Order(2)
    public SecurityWebFilterChain commonSecurityFilterChain(ServerHttpSecurity http) {
        return applyCommon(http)
            .authorizeExchange(exchanges -> exchanges
                .matchers(EndpointRequest.toAnyEndpoint()).permitAll()
                .anyExchange().authenticated()
            )
            .oauth2ResourceServer(oauth -> oauth.jwt(Customizer.withDefaults()))
            .build();
    }

    @Bean
    public WebClient webClient() {
        return WebClient.builder()
            .filter(new ServerBearerExchangeFilterFunction())
            .build();
    }

    protected ServerHttpSecurity applyCommon(ServerHttpSecurity http) {
        return http.csrf(ServerHttpSecurity.CsrfSpec::disable);
    }
}
