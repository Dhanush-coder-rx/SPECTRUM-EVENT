package com.example.api.Controller;


import com.example.api.DTO.EventRequestDTO;
import com.example.api.Entity.EventTypes;
import com.example.api.Entity.Manager;
import com.example.api.Entity.RegisterEvents;
import com.example.api.Entity.User;
import com.example.api.Repository.EventTypesRepository;
import com.example.api.Repository.ManagerRepository;
import com.example.api.Repository.RegisterEventsRepository;
import com.example.api.Repository.UserRepository;
import com.example.api.Service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin("*")
public class RegisterEventsController {

    @Autowired
    RegisterEventsRepository registerEventsRepository;

    @Autowired
    EventTypesRepository eventTypesRepository;

    @Autowired
    ManagerRepository managerRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    private EmailService emailService; // Injecting EmailService

    @PostMapping("/registerEvent/{email}")
    public ResponseEntity<String> registerEvent(
            @PathVariable String email,
            @RequestBody EventRequestDTO eventRequestDTO) {
        try {
            // Find the user by email
            Optional<User> user = userRepository.findByEmail(email);

            // Check if the user exists
            if (user.isEmpty()) {
                return new ResponseEntity<>("User with email " + email + " not found.", HttpStatus.NOT_FOUND);
            }

            // Create and set the RegisterEvents object
            RegisterEvents registerEvent = new RegisterEvents();

            // Set the User from the email (you are getting the User object here)
            registerEvent.setUser(user.get());

            // Set the rest of the fields from the EventRequestDTO
            registerEvent.setName(eventRequestDTO.getName());
            registerEvent.setPhone(eventRequestDTO.getPhone());
            registerEvent.setDiscription(eventRequestDTO.getDiscription());
            registerEvent.setAddress(eventRequestDTO.getAddress());
            registerEvent.setDateOfEvent(eventRequestDTO.getDateOfEvent());
            registerEvent.setSeats(eventRequestDTO.getSeats());

            // Handle the event type
            if (eventRequestDTO.getEventType() != null && eventRequestDTO.getEventType().getId() != null) {
                EventTypes eventType = eventTypesRepository.findById(eventRequestDTO.getEventType().getId()).orElse(null);
                if (eventType == null) {
                    return new ResponseEntity<>("Event Type with ID " + eventRequestDTO.getEventType().getId() + " does not exist.", HttpStatus.BAD_REQUEST);
                }
                registerEvent.setEventType(eventType);
            } else {
                return new ResponseEntity<>("EventType is required.", HttpStatus.BAD_REQUEST);
            }

            // Set the status to "Processing" by default
            registerEvent.setStatus("Processing");
            registerEvent.setTask("Processing");

            // Save the event
            registerEventsRepository.save(registerEvent);

            // Send email to admin
            String adminEmail = "dhanvishrgowda@gmail.com"; // Replace with admin email
            String subject = "New Event Registered: " + registerEvent.getName();
            String body = "<h3>Event Registration Details:</h3>" +
                    "<p><b>Event Name:</b> " + registerEvent.getName() + "</p>" +
                    "<p><b>Date:</b> " + registerEvent.getDateOfEvent() + "</p>" +
                    "<p><b>Description:</b> " + registerEvent.getDiscription() + "</p>" +
                    "<p><b>Address:</b> " + registerEvent.getAddress() + "</p>" +
                    "<p><b>Seats:</b> " + registerEvent.getSeats() + "</p>";

            try {
                emailService.sendEmail(adminEmail, subject, body);
            } catch (Exception emailException) {
                // Log the error to the console if the email fails
                System.err.println("Failed to send email to admin: " + emailException.getMessage());
            }

            // Return the response indicating event registration was successful
            return new ResponseEntity<>("Event registered successfully. Email notification to admin might not have been sent.", HttpStatus.CREATED);

        } catch (Exception e) {
            return new ResponseEntity<>("Event registration failed: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



    @GetMapping("/events/user/{email}")
    public ResponseEntity<List<RegisterEvents>> getEventsByUserEmail(@PathVariable String email) {
        try {
            List<RegisterEvents> events = registerEventsRepository.findByUserEmail(email);
            if (events.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(events, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }






    @GetMapping("/events/processing")
    public ResponseEntity<List<RegisterEvents>> getProcessingEvents() {
        try {
            // Fetch events with status 'Confirmed'
            List<RegisterEvents> confirmedEvents = registerEventsRepository.findByStatus("Processing");

            // Check if any events are found
            if (confirmedEvents.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT); // No events found
            }

            return new ResponseEntity<>(confirmedEvents, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/updateEstimatedPrice/{eventId}")
    public ResponseEntity<String> updateEstimatedPrice(@PathVariable Long eventId, @RequestParam String estimatedPrice) {
        try {
            // Find the event by ID
            Optional<RegisterEvents> registerEventOptional = registerEventsRepository.findById(eventId);

            // Check if the event exists
            if (registerEventOptional.isEmpty()) {
                return new ResponseEntity<>("Event with ID " + eventId + " not found.", HttpStatus.NOT_FOUND);
            }

            // Get the event object
            RegisterEvents registerEvent = registerEventOptional.get();

            // Update the estimatedPrice
            registerEvent.setEstimatedPrice(estimatedPrice);

            // Save the updated event
            registerEventsRepository.save(registerEvent);

            return new ResponseEntity<>("Estimated price updated successfully to ₹" + estimatedPrice + ".", HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>("Failed to update estimated price: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }





    @PutMapping("/updateEventStatus/{eventId}")
    public ResponseEntity<String> updateEventStatus(@PathVariable Long eventId) {
        try {
            // Find the event by ID
            Optional<RegisterEvents> registerEventOptional = registerEventsRepository.findById(eventId);

            // Check if the event exists
            if (registerEventOptional.isEmpty()) {
                return new ResponseEntity<>("Event with ID " + eventId + " not found.", HttpStatus.NOT_FOUND);
            }

            // Get the event object
            RegisterEvents registerEvent = registerEventOptional.get();

            // Update the status to "Confirmed"
            registerEvent.setStatus("Confirmed");

            // Save the updated event
            registerEventsRepository.save(registerEvent);

            return new ResponseEntity<>("Event status updated successfully to 'Confirmed'.", HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>("Failed to update event status: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/events/confirmed")
    public ResponseEntity<List<RegisterEvents>> getConfirmedEvents() {
        try {
            // Fetch events with status 'Confirmed'
            List<RegisterEvents> confirmedEvents = registerEventsRepository.findByStatus("Confirmed");

            // Check if any events are found
            if (confirmedEvents.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT); // No events found
            }

            return new ResponseEntity<>(confirmedEvents, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/assignManager/{eventId}/{managerId}")
    public ResponseEntity<String> assignManager(
            @PathVariable Long eventId,
            @PathVariable Long managerId) {

        try {
            // Find the event by ID
            Optional<RegisterEvents> registerEventOptional = registerEventsRepository.findById(eventId);

            if (registerEventOptional.isEmpty()) {
                return new ResponseEntity<>("Event with ID " + eventId + " not found.", HttpStatus.NOT_FOUND);
            }

            // Get the event object
            RegisterEvents registerEvent = registerEventOptional.get();

            // Validate manager existence
            Optional<Manager> managerOptional = managerRepository.findById(managerId);
            if (managerOptional.isEmpty()) {
                return new ResponseEntity<>("Manager with ID " + managerId + " not found.", HttpStatus.NOT_FOUND);
            }

            // Assign the manager to the event
            Manager manager = managerOptional.get();
            registerEvent.setManager(manager);

            // Save the updated event
            registerEventsRepository.save(registerEvent);

            return new ResponseEntity<>("Manager assigned successfully to event ID " + eventId + ".", HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>("Failed to assign manager: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // GET method to fetch all events with a manager assigned
    @GetMapping("/events/withManager")
    public ResponseEntity<List<RegisterEvents>> getEventsWithManager() {
        // Fetch all events where manager is not null
        List<RegisterEvents> eventsWithManager = registerEventsRepository.findByManagerIsNotNull();

        if (eventsWithManager.isEmpty()) {
            return ResponseEntity.status(404).body(null);
        }

        return ResponseEntity.ok(eventsWithManager);
    }


    // Get events by manager email
    @GetMapping("/events/manager/{email}")
    public ResponseEntity<List<RegisterEvents>> getEventsByManagerEmail(@PathVariable String email) {
        try {
            // Fetch events assigned to the manager using the manager's email
            List<RegisterEvents> events = registerEventsRepository.findByManagerEmail(email);
            if (events.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(events, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/events/updateTask/{id}")
    public ResponseEntity<String> updateTaskToCompleted(@PathVariable Long id) {
        try {
            // Find the event by its ID
            RegisterEvents event = registerEventsRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Event not found with ID: " + id));

            // Update the task to "Completed"
            event.setTask("Completed");
            registerEventsRepository.save(event); // Save the updated event

            return new ResponseEntity<>("Task updated to 'Completed' successfully!", HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("An error occurred while updating the task.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
