package com.example.api.Controller;


import com.example.api.Entity.User;
import com.example.api.Repository.UserRepository;

import com.example.api.Service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@CrossOrigin("*")
public class UserController {

    @Autowired
    UserRepository userRepository;


    @Autowired
    private EmailService emailService; //

    @PostMapping("/registerUser")
    public ResponseEntity<?> registerUser(
            @RequestParam String name,
            @RequestParam String email,
            @RequestParam String password) {
        try {
            // Check if the user already exists
            if (userRepository.existsByEmail(email)) {
                return new ResponseEntity<>("User with this email already exists.", HttpStatus.CONFLICT);
            }

            // Create a new User object
            User obj = new User();
            obj.setName(name);
            obj.setEmail(email);
            obj.setPassword(password);
            obj.setActive(false); // Set isActive to false by default

            // Save user to the database
            userRepository.save(obj);

            // Send the registration email
            try {
                emailService.sendRegistrationEmail(email, name);
            } catch (Exception e) {
                // Log the email error and include the detailed error message in the response
                String errorMessage = "Registered successfully, but failed to send email. Error: " + e.getMessage();
                System.err.println(errorMessage);
                return new ResponseEntity<>(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
            }

            // Return success if everything is fine
            return new ResponseEntity<>("Registered successfully. Account is inactive until verified.", HttpStatus.OK);

        } catch (Exception e) {
            // Handle any other unexpected errors
            return new ResponseEntity<>("Registration failed: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }




    @PutMapping("/updatePasswordUser/{email}")
    public ResponseEntity<?> updatePasswordUser(@PathVariable String email, @RequestParam String newPassword) {
        try {
            // Find the user by email
            Optional<User> userOptional = userRepository.findByEmail(email);
            if (userOptional.isPresent()) {
                User user = userOptional.get();

                // Update the password
                user.setPassword(newPassword);
                userRepository.save(user);

                return ResponseEntity.ok("Password updated successfully!");
            } else {
                return ResponseEntity.status(404).body("User not found with email: " + email);
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating password: " + e.getMessage());
        }
    }

}
