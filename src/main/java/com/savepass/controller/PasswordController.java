package com.savepass.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import com.savepass.model.PasswordEntry;
import com.savepass.model.User;

import com.savepass.service.PasswordService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/passwords")
public class PasswordController {
    private final PasswordService passwordService;

    public PasswordController(PasswordService passwordService) {
        this.passwordService = passwordService;
    }

    // get all password
    @GetMapping("/view")
    public List<PasswordEntry> getPasswords(HttpSession session) {
        User user = (User) session.getAttribute("user");

        if (user == null)
            throw new RuntimeException("Unauthorized");

        return passwordService.getAllPassword(user);
    }

    // tạo password mới
    @PostMapping("/create")
    public PasswordEntry createPassword(@RequestBody PasswordEntry p, HttpSession session) {
        User user = (User) session.getAttribute("user");

        return passwordService.savePassword(p, user);
    }

    // update password
    @PostMapping("/update")
    public PasswordEntry updatePassword(@RequestBody PasswordEntry p, HttpSession session) {
        User user = (User) session.getAttribute("user");

        return passwordService.updatePassword(p, user);
    }

    // delete password
    @PostMapping("/delete")
    public PasswordEntry deletePassword(@RequestBody PasswordEntry p, HttpSession session) {
        User user = (User) session.getAttribute("user");

        return passwordService.deletePassword(p, user);
    }
}
