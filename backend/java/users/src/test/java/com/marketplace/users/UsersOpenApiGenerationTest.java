package com.marketplace.users;

import com.marketplace.common.starter.AbstractOpenApiGenerator;
import com.marketplace.users.service.UserService;
import org.springdoc.core.configuration.SpringDocConfiguration;
import org.springdoc.webflux.core.configuration.SpringDocWebFluxConfiguration;
import org.springframework.boot.autoconfigure.ImportAutoConfiguration;
import org.springframework.boot.webflux.test.autoconfigure.WebFluxTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

@WebFluxTest(controllers = UserController.class)
@ImportAutoConfiguration({SpringDocConfiguration.class, SpringDocWebFluxConfiguration.class})
@MockitoBean(types = UserService.class)
class UsersOpenApiGenerationTest extends AbstractOpenApiGenerator {
}
