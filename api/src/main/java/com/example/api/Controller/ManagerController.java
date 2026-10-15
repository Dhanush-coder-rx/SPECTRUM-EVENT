package com.example.api.Controller;


import com.example.api.Entity.Admin;
import com.example.api.Entity.Manager;
import com.example.api.Repository.ManagerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin("*")
public class ManagerController {

    @Autowired
    ManagerRepository managerRepository;


    @PostMapping("/addManager")
    public ResponseEntity<?> registerUser(@RequestBody Manager obj) {
        managerRepository.save(obj);
        return new ResponseEntity<>("Manager Added Successfully", HttpStatus.OK);
    }

    @GetMapping("/getAllManagers")
    public ResponseEntity<List<Manager>> getAllManagers() {
        List<Manager> managers = managerRepository.findAll();
        return ResponseEntity.ok(managers);
    }

    @PutMapping("/updateManager")
    public ResponseEntity<?> updateManager(@RequestBody Manager updatedManager) {
        try {
            // Check if the Manager exists
            var existingManager = managerRepository.findById(updatedManager.getId())
                    .orElseThrow(() -> new RuntimeException("Manager not found"));

            // Update the Manager's details
            existingManager.setEmail(updatedManager.getEmail());
            existingManager.setPassword(updatedManager.getPassword());
            // Add more fields as necessary

            // Save the updated Manager
            managerRepository.save(existingManager);

            return new ResponseEntity<>("Manager updated successfully", HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/updatePasswordManager/{email}")
    public ResponseEntity<?> updatePassword(@PathVariable String email, @RequestParam String newPassword) {
        try {
            // Find the admin by email
            Optional<Manager> adminOptional = managerRepository.findByEmail(email);
            if (adminOptional.isPresent()) {
                Manager manager = adminOptional.get();

                // Update the password
                manager.setPassword(newPassword);
                managerRepository.save(manager);

                return ResponseEntity.ok("Password updated successfully!");
            } else {
                return ResponseEntity.status(404).body("Admin not found with email: " + email);
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating password: " + e.getMessage());
        }
    }

}
