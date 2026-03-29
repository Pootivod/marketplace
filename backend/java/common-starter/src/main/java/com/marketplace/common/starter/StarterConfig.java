package com.marketplace.common.starter;

import org.jspecify.annotations.NonNull;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.SpringApplicationRunListener;
import org.springframework.boot.bootstrap.ConfigurableBootstrapContext;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;
import java.util.HashMap;
import java.util.Map;

public class StarterConfig implements SpringApplicationRunListener {

    public StarterConfig(SpringApplication application, String[] args) {
    }

    @Override
    public void environmentPrepared(@NonNull ConfigurableBootstrapContext bootstrapContext, ConfigurableEnvironment environment) {
        Map<String, Object> defaults = new HashMap<>();

        defaults.put("management.server.port", 9000);
        defaults.put("management.endpoints.web.exposure.include", "health,info");
        defaults.put("management.endpoint.health.probes.enabled", true);
        defaults.put("management.endpoint.health.show-details", "always");

        defaults.put("spring.security.oauth2.resourceserver.jwt.authorities-claim-name", "realm_access.roles");
        defaults.put("spring.security.oauth2.resourceserver.jwt.authority-prefix", "ROLE_");

        defaults.put("spring.security.oauth2.resourceserver.jwt.issuer-uri",
            environment.resolvePlaceholders("http://${KEYCLOAK_ADDR}/realms/${KEYCLOAK_REALM}"));

        environment.getPropertySources().addLast(new MapPropertySource(this.getClass().getName(), defaults));
    }
}
