package com.recipitmo.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class CountryDto {
    private final String code;
    private final String name;
    private final String dialCode;
    private final String format;
    private final String regex;
}
