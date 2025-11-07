package com.recipitmo.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class apiResponse<T> {
    private String code;
    private String message;
    private T data;
}
