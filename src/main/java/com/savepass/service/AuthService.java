package com.savepass.service;

import org.springframework.stereotype.Service;
import com.savepass.repository.UserRepository;
import com.savepass.model.User;

@Service
public class AuthService {
    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Register
    public User register(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("User already existed");
        }

        return userRepository.save(user);
    }

    // Login
    public User login(String username, String password) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new RuntimeException("username or password is incorrect");
        } else {
            if (!user.getPassword().equals(password)) {
                throw new RuntimeException("username or password is incorrect");
            }
            return user;
        }
    }
}
