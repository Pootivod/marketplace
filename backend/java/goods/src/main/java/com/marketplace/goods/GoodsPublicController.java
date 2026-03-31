package com.marketplace.goods;

import com.marketplace.goods.entity.Goods;
import com.marketplace.goods.repository.GoodsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/public/v1/goods")
@RequiredArgsConstructor
public class GoodsPublicController {

    private final GoodsRepository goodsRepository;

    @GetMapping("{id}")
    public Mono<Goods> get(@PathVariable Long id) {
        return goodsRepository.findById(id);
    }

    @GetMapping("all")
    public Flux<Goods> getAll() {
        return goodsRepository.findAll();
    }
}
