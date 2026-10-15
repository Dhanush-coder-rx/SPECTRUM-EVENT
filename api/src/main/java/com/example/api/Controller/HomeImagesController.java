package com.example.api.Controller;


import com.example.api.Entity.HomeImages;
import com.example.api.Repository.HomeImagesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin("*")
public class HomeImagesController {

    @Autowired
    HomeImagesRepository homeImagesRepository;


    // POST method for image upload
    @PostMapping("/uploadImage")
    public ResponseEntity<String> uploadImage(@RequestParam("image") MultipartFile imageFile) {
        try {
            // Convert the MultipartFile to byte array
            byte[] imageBytes = imageFile.getBytes();

            // Create a new HomeImages entity
            HomeImages homeImage = new HomeImages();
            homeImage.setImage(imageBytes);

            // Save the image to the database
            homeImagesRepository.save(homeImage);

            return new ResponseEntity<>("Image uploaded successfully!", HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>("Failed to upload image: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // GET method to retrieve all images
    @GetMapping("/getAllImages")
    public ResponseEntity<List<HomeImages>> getAllImages() {
        try {
            // Fetch all images from the database
            List<HomeImages> images = homeImagesRepository.findAll();
            return new ResponseEntity<>(images, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // DELETE method for image deletion
    @DeleteMapping("/deleteImage/{id}")
    public ResponseEntity<String> deleteImage(@PathVariable Long id) {
        Optional<HomeImages> homeImage = homeImagesRepository.findById(id);
        if (homeImage.isPresent()) {
            // Delete the image from the database
            homeImagesRepository.delete(homeImage.get());
            return new ResponseEntity<>("Image deleted successfully!", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Image not found with id " + id, HttpStatus.NOT_FOUND);
        }
    }


}
