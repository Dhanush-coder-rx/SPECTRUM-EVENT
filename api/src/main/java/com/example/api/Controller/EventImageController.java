package com.example.api.Controller;

import com.example.api.DTO.EventImageDTO;
import com.example.api.Entity.EventImage;
import com.example.api.Entity.EventTypes;
import com.example.api.Entity.RegisterEvents;
import com.example.api.Repository.EventImageRepository;
import com.example.api.Repository.EventTypesRepository;
import com.example.api.Repository.RegisterEventsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin("*")
public class EventImageController {

    @Autowired
    EventImageRepository eventImageRepository;


    @Autowired
    private RegisterEventsRepository registerEventsRepository;


    @Autowired
    private EventTypesRepository eventTypesRepository;

    @GetMapping("/eventType/event-images/{eventTypeId}")
    public ResponseEntity<?> getEventImagesByEventTypeId(@PathVariable("eventTypeId") Long eventTypeId) {
        try {
            // Find the event type by ID
            EventTypes eventType = eventTypesRepository.findById(eventTypeId)
                    .orElseThrow(() -> new IllegalArgumentException("Event type not found for ID: " + eventTypeId));

            // Find all RegisterEvents associated with the event type
            List<RegisterEvents> registerEventsList = registerEventsRepository.findByEventType(eventType);

            // If no RegisterEvents are found, return a 204 No Content response
            if (registerEventsList.isEmpty()) {
                return ResponseEntity.noContent().build();
            }

            // Find all images associated with these RegisterEvents
            List<EventImageDTO> eventImageDTOList = new ArrayList<>();
            for (RegisterEvents registerEvent : registerEventsList) {
                List<EventImage> eventImages = eventImageRepository.findByRegisteredEvent(registerEvent);

                // Map EventImage to EventImageDTO
                for (EventImage eventImage : eventImages) {
                    EventImageDTO eventImageDTO = new EventImageDTO(
                            eventImage.getId(),
                            java.util.Base64.getEncoder().encodeToString(eventImage.getImage())
                    );
                    eventImageDTOList.add(eventImageDTO);
                }
            }

            // Return the list of images
            return ResponseEntity.ok(eventImageDTOList);

        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("An unexpected error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/event-image/{registerEventId}")
    public ResponseEntity<String> addEventImage(
            @PathVariable("registerEventId") Long registerEventId,
            @RequestParam("file") MultipartFile file) {
        try {
            // Find the associated registered event
            RegisterEvents registeredEvent = registerEventsRepository.findById(registerEventId)
                    .orElseThrow(() -> new IllegalArgumentException("Registered event not found for ID: " + registerEventId));

            // Create and save the EventImage
            EventImage eventImage = new EventImage();
            eventImage.setImage(file.getBytes());
            eventImage.setRegisteredEvent(registeredEvent);
            eventImageRepository.save(eventImage);

            return new ResponseEntity<>("Image uploaded successfully!", HttpStatus.CREATED);
        } catch (IOException e) {
            return new ResponseEntity<>("Error processing the image file: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("An unexpected error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // New GET method to fetch all images for a given registerEventId
    @GetMapping("/event-images/{registerEventId}")
    public ResponseEntity<?> getEventImagesByRegisterEventId(@PathVariable("registerEventId") Long registerEventId) {
        try {
            // Find the associated registered event
            RegisterEvents registeredEvent = registerEventsRepository.findById(registerEventId)
                    .orElseThrow(() -> new IllegalArgumentException("Registered event not found for ID: " + registerEventId));

            // Fetch all images associated with the registered event
            List<EventImage> eventImages = eventImageRepository.findByRegisteredEvent(registeredEvent);

            // Convert the images to a list of DTOs
            List<EventImageDTO> eventImageDTOs = eventImages.stream()
                    .map(eventImage -> new EventImageDTO(
                            eventImage.getId(),
                            "data:image/jpeg;base64," + java.util.Base64.getEncoder().encodeToString(eventImage.getImage()) // prefix for image type
                    ))
                    .collect(Collectors.toList());

            return new ResponseEntity<>(eventImageDTOs, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("An unexpected error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @DeleteMapping("/event-image/{imageId}")
    public ResponseEntity<String> deleteImage(@PathVariable Long imageId) {
        try {
            // Check if the image exists
            EventImage eventImage = eventImageRepository.findById(imageId)
                    .orElseThrow(() -> new RuntimeException("Image not found with ID: " + imageId));

            // Delete the image
            eventImageRepository.delete(eventImage);

            return ResponseEntity.ok("Image deleted successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to delete the image: " + e.getMessage());
        }
    }

    // New method to fetch all images
    @GetMapping("/event-images")
    public ResponseEntity<?> getAllEventImages() {
        try {
            // Fetch all event images from the database
            List<EventImage> allEventImages = eventImageRepository.findAll();

            // Convert binary images to Base64 strings for client response
            List<String> imageBase64List = allEventImages.stream()
                    .map(eventImage -> java.util.Base64.getEncoder().encodeToString(eventImage.getImage()))
                    .collect(Collectors.toList());

            return new ResponseEntity<>(imageBase64List, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("An unexpected error occurred: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
