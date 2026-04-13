package com.savepass.service;

import org.springframework.stereotype.Service;
import com.savepass.repository.PasswordRepository;
import com.savepass.model.PasswordEntry;
import com.savepass.model.User;

import java.util.List;

@Service
public class PasswordService {
     private final PasswordRepository passwordRepository;

     public PasswordService(PasswordRepository passwordRepository) {
          this.passwordRepository = passwordRepository;
     }

     // lấy toàn bộ pasword của user
     public List<PasswordEntry> getAllPassword(User user) {
          return passwordRepository.findByUser(user);
     }

     // save password mới
     public PasswordEntry savePassword(PasswordEntry p, User user) {
          if (passwordRepository.existsByUserAndSiteAndUsername(user, p.getSite(), p.getUsername())) {
               throw new RuntimeException("Bạn đã lưu tài khoản cho trang web này rồi!");
          }
          p.setUser(user);
          return passwordRepository.save(p);
     }

     // update password
     public PasswordEntry updatePassword(PasswordEntry p, User user) {
          PasswordEntry existing = passwordRepository.findById(p.getId())
               .orElseThrow(() -> new RuntimeException("Không tìm thấy mật khẩu!"));
               
          if (!existing.getUser().getId().equals(user.getId())) {
               throw new RuntimeException("Không có quyền chỉnh sửa!");
          }
          
          existing.setSite(p.getSite());
          existing.setUsername(p.getUsername());
          existing.setPassword(p.getPassword());
          existing.setNote(p.getNote());
          
          return passwordRepository.save(existing);
     }

     // delete password
     public PasswordEntry deletePassword(PasswordEntry p, User user) {
          PasswordEntry existing = passwordRepository.findById(p.getId())
               .orElseThrow(() -> new RuntimeException("Không tìm thấy mật khẩu!"));
               
          if (!existing.getUser().getId().equals(user.getId())) {
               throw new RuntimeException("Không có quyền xoá!");
          }
          
          passwordRepository.delete(existing);
          return existing;
     }

}
