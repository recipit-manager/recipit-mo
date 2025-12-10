package com.recipitmo.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class IngredientDto {
    private final String name;
    private final String categoryCode;
    private final String categoryName;
    private final String quantity;
    private final String unit;
    private final String tip;
}