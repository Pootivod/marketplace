package com.marketplace.common.starter;

import org.springdoc.core.properties.SpringDocConfigProperties;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;

@AutoConfiguration
public class SpringDocConfigPropertiesBean {

    @Bean
    @ConditionalOnMissingBean(SpringDocConfigProperties.class)
    SpringDocConfigProperties springDocConfigProperties() {
        return new SpringDocConfigProperties();
    }
}
