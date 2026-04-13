package com.savepass.repository;

import com.savepass.model.PasswordEntry;
import com.savepass.model.User;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PasswordRepository extends JpaRepository<PasswordEntry, Long> {

    List<PasswordEntry> findByUser(User user);

    boolean existsByUserAndSiteAndUsername(User user, String site, String username);

    List<PasswordEntry> findBySite(String site);

    List<PasswordEntry> findByUsername(String username);

}
