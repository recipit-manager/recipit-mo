package com.recipitmo.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class UserDraftRecipeDto {
    private final String recipeNo;
    private final String name;
    private final String description;
    private final String imageUrl;
    private final int cookingTime;
    private final String difficulty;
}
