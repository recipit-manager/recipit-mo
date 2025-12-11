package com.recipitmo.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Getter
@RequiredArgsConstructor
public class StepDto {
    private final String content;
    private final List<String> imageUrlList;
}
