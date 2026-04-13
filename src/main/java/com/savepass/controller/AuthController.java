package com.savepass.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.savepass.model.User;
import com.savepass.service.AuthService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // register
    @PostMapping("/register")
    public User register(@RequestBody User request, HttpSession session) {
        User user = authService.register(request);
        session.setAttribute("user", user);
        return user;
    }

    // login
    @PostMapping("/login")
    public User login(@RequestBody User request, HttpSession session) {
        User user = authService.login(request.getUsername(), request.getPassword());
        session.setAttribute("user", user);
        return user;
    }

    // logout
    @PostMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "Logged out";
    }

}
