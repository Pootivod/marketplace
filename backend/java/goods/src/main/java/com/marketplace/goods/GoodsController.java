package com.marketplace.goods;

import com.marketplace.goods.dto.GoodsDto;
import com.marketplace.goods.dto.mappers.GoodsMapper;
import com.marketplace.goods.entity.Goods;
import com.marketplace.goods.repository.GoodsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/v1/goods")
@RequiredArgsConstructor
public class GoodsController {

    private final GoodsMapper goodsMapper;
    private final GoodsRepository goodsRepository;

    @PostMapping
    public Mono<Goods> create(@RequestBody GoodsDto goodsDto) {
        Goods goods = goodsMapper.toGoods(goodsDto);
        return goodsRepository.save(goods);
    }

    @GetMapping("{id}")
    public Mono<Goods> get(@PathVariable Long id) {
        return goodsRepository.findById(id);
    }

    @GetMapping("all")
    public Flux<Goods> getAll() {
        return goodsRepository.findAll();
    }

    @PatchMapping
    public Mono<Goods> update(@RequestBody Goods goods) {
        return goodsRepository.save(goods);
    }

    @DeleteMapping(path = "{id}")
    public Mono<Void> delete(@PathVariable Long id) {
        return goodsRepository.deleteById(id);
    }
}
