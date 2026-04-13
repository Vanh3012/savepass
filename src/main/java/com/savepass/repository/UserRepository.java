package com.savepass.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.savepass.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByUsername(String username);

    User findByUsername(String username);

}
