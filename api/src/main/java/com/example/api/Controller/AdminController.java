package com.example.api.Controller;

import com.example.api.Entity.Admin;
import com.example.api.Repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@CrossOrigin("*")
public class AdminController {

    @Autowired
    AdminRepository adminRepository;

    @PutMapping("/updatePassword/{email}")
    public ResponseEntity<?> updatePassword(@PathVariable String email, @RequestParam String newPassword) {
        try {
            // Find the admin by email
            Optional<Admin> adminOptional = adminRepository.findByEmail(email);
            if (adminOptional.isPresent()) {
                Admin admin = adminOptional.get();

                // Update the password
                admin.setPassword(newPassword);
                adminRepository.save(admin);

                return ResponseEntity.ok("Password updated successfully!");
            } else {
                return ResponseEntity.status(404).body("Admin not found with email: " + email);
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating password: " + e.getMessage());
        }
    }
}
