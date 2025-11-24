package com.recipitmo.client.api;

import com.recipitmo.client.RetrofitClient;
import com.recipitmo.common.Constants;
import com.recipitmo.dto.ApiResponse;
import com.recipitmo.dto.NotificationDto;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import retrofit2.Response;

import java.util.Collections;
import java.util.List;

@Slf4j
public class NoticeApi {
    public List<NotificationDto> getNoticeList(HttpServletRequest request) {
        try {
            String cookieHeader = request.getHeader("Cookie");

            Response<ApiResponse<List<NotificationDto>>> response =
                    RetrofitClient.getUserApiService()
                            .getNotificationList(cookieHeader)
                            .execute();

            ApiResponse<List<NotificationDto>> body = response.body();
            boolean isSuccess = body != null && Constants.responseCode.SUCCESS.equals(body.getCode());

            if (isSuccess) {
                return body.getData();
            }

        } catch (Exception e) {
            log.error("Failed to load notification list", e);
        }

        return Collections.emptyList();
    }
}
