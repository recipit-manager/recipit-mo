package com.recipitmo.controller;

import com.recipitmo.client.api.CommonApi;
import com.recipitmo.dto.CountryDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

@Slf4j
@Controller
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {
    private final CommonApi commonApi = new CommonApi();

    @GetMapping("/signUp")
    public ModelAndView initSignUpPage(
            @CookieValue(value = "language", required = false, defaultValue = "KO") String language
    ) {
        ModelAndView mv = new ModelAndView("/user/signUp");

        try {
            List<String> emailDomains = commonApi.getEmailDomainList(language);
            List<CountryDto> countries = commonApi.getCountryList(language);

            mv.addObject("emailDomains", emailDomains);
            mv.addObject("countries", countries);

        } catch (Exception e) {
            log.error("회원가입 초기화 실패", e);
        }

        return mv;
    }

    @GetMapping("/login")
    public ModelAndView initLoginPage() {
        return new ModelAndView("/user/login");
    }

    @GetMapping("/findId")
    public ModelAndView initFindIdPage(
            @CookieValue(value = "language", required = false, defaultValue = "KO") String language
    ) {
        ModelAndView mv = new ModelAndView("/user/findId");

        try {
            List<CountryDto> countries = commonApi.getCountryList(language);
            mv.addObject("countries", countries);
        } catch (Exception e) {
            log.error("아이디 찾기 초기화 실패", e);
        }

        return mv;
    }

    @GetMapping("/findPassword")
    public ModelAndView initFindPasswordPage(
            @CookieValue(value = "language", required = false, defaultValue = "KO") String language
    ) {
        ModelAndView mv = new ModelAndView("/user/findPassword");

        try {
            List<CountryDto> countries = commonApi.getCountryList(language);
            mv.addObject("countries", countries);
        } catch (Exception e) {
            log.error("비밀번호 찾기 초기화 실패", e);
        }

        return mv;
    }
}
