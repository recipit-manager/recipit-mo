package com.recipitmo.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class apiResponse<T> {
    private final String code;
    private final String message;
    private final T data;
}
