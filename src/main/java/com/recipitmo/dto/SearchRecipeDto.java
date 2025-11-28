package com.recipitmo.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Getter
@RequiredArgsConstructor
public class SearchRecipeDto {
    private final List<RecipeDto> recipelist;
    private final List<CommonCode> categorylist;
}
