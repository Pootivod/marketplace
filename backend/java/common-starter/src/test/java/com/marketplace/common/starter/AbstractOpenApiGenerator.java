package com.marketplace.common.starter;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.test.web.reactive.server.WebTestClient;

public abstract class AbstractOpenApiGenerator {

    @Autowired
    private ApplicationContext applicationContext;

    @Test
    void shouldGenerateOpenApiSpec() throws IOException {
        String spec = WebTestClient.bindToApplicationContext(applicationContext)
            .configureClient()
            .build()
            .get()
            .uri("/v3/api-docs")
            .exchange()
            .expectStatus().isOk()
            .expectBody(String.class)
            .returnResult()
            .getResponseBody();

        Path outputPath = Path.of(
            System.getProperty("openapi.outputDir", "."),
            System.getProperty("openapi.outputFileName", "openapi.json")
        );
        Path parent = outputPath.getParent();

        if (parent != null) {
            Files.createDirectories(parent);
        }

        Files.writeString(outputPath, spec == null ? "" : spec);
    }

}
