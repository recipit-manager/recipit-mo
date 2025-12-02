package com.recipitmo.client.api;

import com.recipitmo.client.RetrofitClient;
import com.recipitmo.dto.ApiResponse;
import com.recipitmo.dto.RefriItemRecipeListDto;
import com.recipitmo.service.RefriService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import retrofit2.Response;

import java.util.Collections;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
public class RefriApi {

    private final RefriService refriService = RetrofitClient.getRefriService();

    public List<RefriItemRecipeListDto> getRefriRecipeList(
            List<String> ingredients,
            int page,
            int size,
            HttpServletRequest request) {

        try {
            Response<ApiResponse<List<RefriItemRecipeListDto>>> response =
                    refriService.getRefriRecipeList(request.getHeader("Cookie"), ingredients, page, size).execute();

            if (response.isSuccessful() && response.body() != null) {
                return response.body().getData();
            } else {
                log.error("HTTP Error Refri Recipe List API: {}", response.code());
            }
        } catch (Exception e) {
            log.error("Refri Recipe API Exception", e);
        }

        return Collections.emptyList();
    }
}