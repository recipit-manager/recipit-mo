package com.recipitmo.controller;

import com.recipitmo.client.api.CommonApi;
import com.recipitmo.client.api.RefriApi;
import com.recipitmo.common.Constants;
import com.recipitmo.dto.RefriItemRecipeListDto;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import java.util.Arrays;
import java.util.List;

@Slf4j
@Controller
@RequiredArgsConstructor
@RequestMapping("/refri")
public class RefriController {
    private final CommonApi commonApi = new CommonApi();
    private final RefriApi refriApi = new RefriApi();

    @GetMapping("/ingredientList")
    public ModelAndView initRefriPage(HttpServletRequest request) {
        ModelAndView mv = new ModelAndView("/refri/ingredientList");

        mv.addObject("ingredientCategoryList", commonApi.getIngredientCategoryList());

        return mv;
    }

    @GetMapping("/list")
    public ModelAndView viewRefriRecipeList(
            @RequestParam("ingredients") String ingredients,
            HttpServletRequest request
    ) {

        ModelAndView mv = new ModelAndView("/refri/refriItemList");

        List<String> keywordList = Arrays.asList(ingredients.split(","));

        log.info("Searching recipes with ingredients = {}", keywordList);

        List<RefriItemRecipeListDto> recipeList = refriApi.getRefriRecipeList(
                keywordList,
                Constants.defaultPageSet.PAGE,
                Constants.defaultPageSet.SIZE,
                request
        );

        mv.addObject("keywordList", keywordList);
        mv.addObject("recipeList", recipeList);
        mv.addObject("page", Constants.defaultPageSet.PAGE);
        mv.addObject("size", Constants.defaultPageSet.SIZE);

        return mv;
    }
}
