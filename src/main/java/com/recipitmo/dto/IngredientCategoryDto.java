package com.recipitmo.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Getter
@RequiredArgsConstructor
public class IngredientCategoryDto {
    private final List<IngredientGroupDto> ingredientGroupList;
    private final List<String> categoryList;
}
