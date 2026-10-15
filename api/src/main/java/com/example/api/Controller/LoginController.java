package com.example.api.Controller;

import com.example.api.Entity.User;
import com.example.api.Repository.AdminRepository;
import com.example.api.Repository.ManagerRepository;
import com.example.api.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
public class LoginController {

    @Autowired
    AdminRepository adminRepository;

    @Autowired
    ManagerRepository managerRepository;

    @Autowired
    UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam String email, @RequestParam String password, @RequestParam String usertype) {
        try {
            // Handle User login
            if (usertype.equalsIgnoreCase("User")) {
                var user = userRepository.findByEmail(email)
                        .orElseThrow(() -> new RuntimeException("User not found"));

                if (user.getPassword().equals(password)) {
                    user.setActive(true); // Set isActive to true
                    userRepository.save(user);

                    return new ResponseEntity<>("User login successful", HttpStatus.OK);
                }
                return new ResponseEntity<>("Invalid User password", HttpStatus.UNAUTHORIZED);

            }
            // Handle Manager login
            else if (usertype.equalsIgnoreCase("Manager")) {
                var manager = managerRepository.findByEmail(email)
                        .orElseThrow(() -> new RuntimeException("Manager not found"));

                if (manager.getPassword().equals(password)) {
                    return new ResponseEntity<>("Manager login successful", HttpStatus.OK);
                }
                return new ResponseEntity<>("Invalid Manager password", HttpStatus.UNAUTHORIZED);

            }
            // Handle Admin login
            else if (usertype.equalsIgnoreCase("Admin")) {
                var admin = adminRepository.findByEmail(email)
                        .orElseThrow(() -> new RuntimeException("Admin not found"));

                if (admin.getPassword().equals(password)) {
                    return new ResponseEntity<>("Admin login successful", HttpStatus.OK);
                }
                return new ResponseEntity<>("Invalid Admin password", HttpStatus.UNAUTHORIZED);

            }
            // Invalid usertype
            else {
                return new ResponseEntity<>("Invalid user type", HttpStatus.BAD_REQUEST);
            }

        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/active-users-count")
    public long getActiveUsersCount() {
        return userRepository.countActiveUsers();
    }


    @PostMapping("/logout/{email}")
    public ResponseEntity<?> logout(@PathVariable String email) {
        try {
            // Find the user by email and check the user type
            var user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            user.setActive(false); // Set the user to inactive (logged out)
            userRepository.save(user);

            return new ResponseEntity<>("User logged out successfully", HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }


}
