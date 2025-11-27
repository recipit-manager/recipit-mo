package com.recipitmo.controller;

import com.recipitmo.client.api.CommonApi;
import com.recipitmo.client.api.RecipeApi;
import com.recipitmo.dto.SearchRecipeDto;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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

    @GetMapping("/recipe/list")
    public ModelAndView initRecipeListPage(
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "categoryCode", required = false) String categoryCode,
            @RequestParam(value = "sort", defaultValue = "recent") String sort,
            HttpServletRequest request
    ) {

        int page = 1;
        int size = 10;
        SearchRecipeDto firstResult;

        if ("like".equals(sort)) {
            firstResult = recipeApi.getLikeOrderRecipeList(keyword, categoryCode, page, size, request);
        } else {
            firstResult = recipeApi.getRecentOrderRecipeList(keyword, categoryCode, page, size, request);
        }

        boolean categoryExists = true;

        if (categoryCode != null) {
            String finalCategoryCode = categoryCode;
            categoryExists = firstResult.getCategorylist().stream()
                    .anyMatch(c -> c.getCode().equals(finalCategoryCode));
        }

        if (!categoryExists) {
            categoryCode = null;

            if ("like".equals(sort)) {
                firstResult = recipeApi.getLikeOrderRecipeList(keyword, null, page, size, request);
            } else {
                firstResult = recipeApi.getRecentOrderRecipeList(keyword, null, page, size, request);
            }
        }

        ModelAndView mv = new ModelAndView("/recipe/recipeList");
        mv.addObject("recipeList", firstResult);
        mv.addObject("keyword", keyword);
        mv.addObject("categoryCode", categoryCode);
        mv.addObject("sort", sort);

        return mv;
    }

    @GetMapping("/recipe/like-order/list")
    public ModelAndView initLikeOrderListPage(
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "categoryCode", required = false) String categoryCode,
            @RequestParam(value = "sort", defaultValue = "recent") String sort,
            HttpServletRequest request
    ) {

        int page = 1;
        int size = 10;

        SearchRecipeDto firstResult =
                recipeApi.getLikeOrderRecipeList(keyword, categoryCode, page, size, request);

        boolean categoryExists = true;

        if (categoryCode != null) {
            String finalCategoryCode = categoryCode;
            categoryExists = firstResult.getCategorylist().stream()
                    .anyMatch(c -> c.getCode().equals(finalCategoryCode));
        }

        if (!categoryExists) {
            categoryCode = null;

            firstResult = recipeApi.getLikeOrderRecipeList(keyword, null, page, size, request);
        }

        ModelAndView mv = new ModelAndView("/recipe/recipeList");

        mv.addObject("recipeList", firstResult);
        mv.addObject("keyword", keyword);
        mv.addObject("categoryCode", categoryCode);
        mv.addObject("sort", sort);

        return mv;
    }
}
