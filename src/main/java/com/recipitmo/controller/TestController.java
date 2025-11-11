package com.recipitmo.controller;

import com.recipitmo.client.RetrofitClient;
import java.io.IOException;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;
import retrofit2.Call;

@Controller
@RequestMapping({"/test"})
public class TestController {
    private Logger logger = Logger.getLogger(TestController.class);

    public TestController() {
    }

    @GetMapping({"/page"})
    public ModelAndView Home() throws Exception {
        ModelAndView mv = new ModelAndView();
        mv.setViewName("test");
        return mv;
    }

    @GetMapping({"/callApi"})
    public ModelAndView testCallApi() {
        ModelAndView mav = new ModelAndView("test");
        Call getTest = RetrofitClient.getApiService().getTest();

        try {
            this.logger.info(getTest.clone().execute().body().toString());
            mav.addObject("data", getTest.clone().execute().body());
        } catch (IOException e) {
            e.printStackTrace();
        }

        return mav;
    }
}
