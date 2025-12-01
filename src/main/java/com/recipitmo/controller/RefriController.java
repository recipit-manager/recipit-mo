package com.recipitmo.controller;

import com.recipitmo.client.api.CommonApi;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Slf4j
@Controller
@RequiredArgsConstructor
@RequestMapping("/refri")
public class RefriController {
    private final CommonApi commonApi = new CommonApi();

    @GetMapping("/ingredientList")
    public ModelAndView initRefriPage(HttpServletRequest request) {
        ModelAndView mv = new ModelAndView("/refri/ingredientList");

        mv.addObject("ingredientCategoryList", commonApi.getIngredientCategoryList());

        return mv;
    }
}
