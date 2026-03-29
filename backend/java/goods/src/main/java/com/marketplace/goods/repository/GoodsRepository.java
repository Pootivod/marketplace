package com.marketplace.goods.repository;

import com.marketplace.goods.entity.Goods;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;

public interface GoodsRepository extends ReactiveCrudRepository<Goods, Long> {
}
