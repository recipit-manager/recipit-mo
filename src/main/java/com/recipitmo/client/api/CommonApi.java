package com.recipitmo.client.api;

import com.recipitmo.client.RetrofitClient;
import com.recipitmo.dto.CountryDto;
import com.recipitmo.dto.apiResponse;
import com.recipitmo.service.CommonService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import retrofit2.Response;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
public class CommonApi {

    private final CommonService commonService;

    public CommonApi() {
        this.commonService = RetrofitClient.getCommonService();
    }

    public List<String> getEmailDomainList(String lang) {
        try {
            Response<apiResponse<List<String>>> response = commonService.getEmailDomainList(lang).execute();

            if (response.isSuccessful() && response.body() != null) {
                return response.body().getData();
            } else {
                log.error("이메일 도메인 목록 API 호출 실패: HTTP {}", response.code());
            }
        } catch (IOException e) {
            log.error("이메일 도메인 목록 API 요청 중 오류 발생", e);
        }

        return Collections.emptyList();
    }

    public List<CountryDto> getCountryList(String language) {
        try {
            Response<apiResponse<List<CountryDto>>> response =
                    commonService.getCountryList(language, language).execute();

            if (response.isSuccessful() && response.body() != null) {
                return response.body().getData();
            } else {
                log.error("국가코드 목록 API 호출 실패: HTTP {}", response.code());
            }
        } catch (IOException e) {
            log.error("국가코드 목록 API 요청 중 오류 발생", e);
        }
        return Collections.emptyList();
    }
}
