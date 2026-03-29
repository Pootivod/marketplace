package com.marketplace.goods;

import com.marketplace.common.starter.AbstractOpenApiGenerator;
import com.marketplace.goods.dto.mappers.GoodsMapper;
import com.marketplace.goods.repository.GoodsRepository;
import org.springdoc.core.configuration.SpringDocConfiguration;
import org.springdoc.webflux.core.configuration.SpringDocWebFluxConfiguration;
import org.springframework.boot.autoconfigure.ImportAutoConfiguration;
import org.springframework.boot.webflux.test.autoconfigure.WebFluxTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

@WebFluxTest(controllers = GoodsController.class)
@ImportAutoConfiguration({SpringDocConfiguration.class, SpringDocWebFluxConfiguration.class})
@MockitoBean(types = {GoodsRepository.class, GoodsMapper.class})
class GoodsOpenApiGenerationTest extends AbstractOpenApiGenerator {
}
