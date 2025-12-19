package com.recipitmo.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class PreferCategoryDto {
    private final String categoryCode;
    private final String categoryName;
    private final String statusCode;
    private final String statusName;
    private final String iconUrl;
}
