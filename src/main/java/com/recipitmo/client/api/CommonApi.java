package com.recipitmo.client.api;

import com.recipitmo.client.RetrofitClient;
import com.recipitmo.dto.CountryDto;
import com.recipitmo.dto.ApiResponse;
import com.recipitmo.dto.RecipeCategoryDto;
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

    public List<String> getEmailDomainList(String language) {
        try {
            Response<ApiResponse<List<String>>> response = commonService.getEmailDomainList(language).execute();

            if (response.isSuccessful() && response.body() != null) {
                return response.body().getData();
            } else {
                log.error("Failed to load domain List: HTTP {}", response.code());
            }
        } catch (IOException e) {
            log.error("Failed to load domain List", e);
        }

        return Collections.emptyList();
    }

    public List<CountryDto> getCountryList(String language) {
        try {
            Response<ApiResponse<List<CountryDto>>> response = commonService.getCountryList(language, language).execute();

            if (response.isSuccessful() && response.body() != null) {
                return response.body().getData();
            } else {
                log.error("Failed to load country List: HTTP {}", response.code());
            }
        } catch (IOException e) {
            log.error("Failed to load country List", e);
        }
        return Collections.emptyList();
    }

    public List<RecipeCategoryDto> getRecipeCategoryList() {
        try {
            Response<ApiResponse<List<RecipeCategoryDto>>> response = commonService.getRecipeCategoryList().execute();

            if (response.isSuccessful() && response.body() != null) {
                return response.body().getData();
            } else {
                log.error("Failed to load recipeCategory List: HTTP {}", response.code());
            }
        } catch (IOException e) {
            log.error("Failed to load recipeCategory List", e);
        }
        return Collections.emptyList();
    }
}
