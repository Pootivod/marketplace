package com.marketplace.goods.dto.mappers;

import com.marketplace.goods.dto.GoodsDto;
import com.marketplace.goods.entity.Goods;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface GoodsMapper {

    Goods toGoods(GoodsDto dto);
}
