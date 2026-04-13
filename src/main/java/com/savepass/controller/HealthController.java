package com.savepass.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @GetMapping("/")
    public String root() {
        return "SavePass API is running";
    }

    @GetMapping("/api/health")
    public String health() {
        return "ok";
    }
}
