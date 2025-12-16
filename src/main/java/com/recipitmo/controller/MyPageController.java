package com.recipitmo.controller;

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
@RequestMapping("/mypage")
public class MyPageController {
    private final RecipeApi recipeApi = new RecipeApi();

    @GetMapping()
    public ModelAndView initMyPage(HttpServletRequest request) {
        ModelAndView mv = new ModelAndView("/mypage/mypage");

        mv.addObject("uploadCount", recipeApi.getUserUploadRecipeCount(request).orElse(0));
        mv.addObject("draftCount", recipeApi.getUserDraftRecipeCount(request).orElse(0));
        mv.addObject("likeCount", recipeApi.getUserLikeRecipeCount(request).orElse(0));
        mv.addObject("bookmarkCount", recipeApi.getUserBookmarkRecipeCount(request).orElse(0));

        return mv;
    }

    @GetMapping("/list/upload")
    public ModelAndView initUploadRecipePage(HttpServletRequest request) {
        ModelAndView mv = new ModelAndView("/mypage/list/upload");

        mv.addObject("likeCount", recipeApi.getUserLikeRecipeCount(request).orElse(0));
        mv.addObject("uploadCount", recipeApi.getUserUploadRecipeCount(request).orElse(0));
        mv.addObject("uploadRecipes", recipeApi.getUserUploadRecipes(request, 1, 10));

        return mv;
    }

    @GetMapping("/list/draft")
    public ModelAndView initDraftRecipePage(HttpServletRequest request) {
        ModelAndView mv = new ModelAndView("/mypage/list/draft");

        mv.addObject("draftCount", recipeApi.getUserDraftRecipeCount(request).orElse(0));
        mv.addObject("draftRecipes", recipeApi.getUserDraftRecipes(request));

        return mv;
    }

    @GetMapping("/list/recent")
    public ModelAndView initRecentRecipePage(HttpServletRequest request) {
        ModelAndView mv = new ModelAndView("/mypage/list/recent");

        mv.addObject("recentRecipes", recipeApi.getUserRecentRecipes(request));

        return mv;
    }

    @GetMapping("/list/bookmark")
    public ModelAndView initRecentBookmarkPage(HttpServletRequest request) {
        ModelAndView mv = new ModelAndView("/mypage/list/bookmark");

        mv.addObject("bookmarkCount", recipeApi.getUserBookmarkRecipeCount(request).orElse(0));
        mv.addObject("recentRecipes", recipeApi.getUserBookmarkRecipes(request, 1, 10));

        return mv;
    }
}
