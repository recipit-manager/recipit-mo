package com.recipitmo.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class PopularRecipeDto {
    private final String id;
    private final String name;
    private final String imageUrl;
    private final int likeCount;
    private final Boolean isLiked;
}
