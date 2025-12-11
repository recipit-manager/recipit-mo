package com.recipitmo.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class ReportCategoryDto {
    private final String categoryCode;
    private final String categoryName;
}