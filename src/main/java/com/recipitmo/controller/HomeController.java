package com.recipitmo.controller;

import com.recipitmo.client.api.CommonApi;
import com.recipitmo.client.api.RecipeApi;
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
@RequestMapping("/home")
public class HomeController {
    private final CommonApi commonApi = new CommonApi();
    private final RecipeApi recipeApi = new RecipeApi();

    @GetMapping()
    public ModelAndView initHomePage(HttpServletRequest request) {
        ModelAndView mv = new ModelAndView("/recipe/home");

        mv.addObject("recipeCategoryList", commonApi.getRecipeCategoryList());
        mv.addObject("popularRecipeList", recipeApi.getPopularRecipeList(request));

        return mv;
    }
}
