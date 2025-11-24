package com.recipitmo.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class NotificationDto {
    private String id;
    private String contents;
    private String recipeNo;
    private CommonCode notificationType;
    private String readYn;
    private String receivedTime;
}