package com.recipitmo.service;

import com.recipitmo.dto.CountryDto;
import com.recipitmo.dto.apiResponse;
import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.Query;

import java.util.List;

public interface CommonService {

    @GET("common/email-domain/list")
    Call<apiResponse<List<String>>> getEmailDomainList(
            @Header("Accept-Language") String lang
    );

    @GET("common/country/list")
    Call<apiResponse<List<CountryDto>>> getCountryList(
            @Header("Accept-Language") String language,
            @Query("language") String groupCode
    );
}
