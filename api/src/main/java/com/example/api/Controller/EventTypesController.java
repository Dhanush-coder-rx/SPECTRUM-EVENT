package com.example.api.Controller;

import com.example.api.Entity.EventTypes;
import com.example.api.Repository.EventTypesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
public class EventTypesController {

    @Autowired
    EventTypesRepository eventTypesRepository;


    @PostMapping("/addEventType")
    public ResponseEntity<?> addEventType(@RequestParam String eTypes) {
        try {
            // Check if the event type already exists
            if (eventTypesRepository.existsByETypes(eTypes)) {
                return ResponseEntity.status(400).body("Event Type already exists!");
            }

            // Create a new event type and save it
            EventTypes eventType = new EventTypes();
            eventType.seteTypes(eTypes);

            eventTypesRepository.save(eventType);

            return ResponseEntity.ok("Event Type added successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error adding Event Type: " + e.getMessage());
        }
    }

    @GetMapping("/getEventTypes")
    public ResponseEntity<List<EventTypes>> getAllEventTypes() {
        List<EventTypes> eventTypesList = eventTypesRepository.findAll();
        if (eventTypesList.isEmpty()) {
            return ResponseEntity.noContent().build(); // Returns 204 if no event types exist
        }
        return ResponseEntity.ok(eventTypesList); // Returns 200 with the list of event types
    }

    // PUT method to update an existing EventType
    @PutMapping("/updateEventType/{id}")
    public ResponseEntity<?> updateEventType(@PathVariable Long id, @RequestParam String eTypes) {
        try {
            // Check if the EventType exists by id
            EventTypes eventType = eventTypesRepository.findById(id).orElseThrow(() -> new RuntimeException("Event Type not found"));

            // Update the eTypes value
            eventType.seteTypes(eTypes);

            eventTypesRepository.save(eventType);

            return ResponseEntity.ok("Event Type updated successfully!");
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating Event Type: " + e.getMessage());
        }
    }
}
