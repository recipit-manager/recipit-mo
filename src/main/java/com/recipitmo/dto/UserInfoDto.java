package com.recipitmo.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class UserInfoDto {
    final private String email;
    final private String nickName;
    final private String firstName;
    final private String middleName;
    final private String lastName;
    final private String phoneNumber;
    final private String countryCode;
}