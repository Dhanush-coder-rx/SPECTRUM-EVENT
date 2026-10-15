package com.example.api.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.List;
import java.util.Optional;

@Entity
public class RegisterEvents {
    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String phone;
    // Foreign key to User
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false) // Ensures non-null association
    @JsonManagedReference // Avoids infinite recursion
    private User user;


    // Foreign key to EventType
    @ManyToOne
    @JoinColumn(name = "event_type_id", nullable = false)
    private EventTypes eventType;


    private String discription;
    private String address;
    private String dateOfEvent;
    private String seats;

    private String status;

    private String estimatedPrice;
    // Foreign key to Manager
    @ManyToOne
    @JoinColumn(name = "manager_id",  nullable = true)
    private Manager manager;

    private String task;


    // One-to-many relationship with EventImages
    @OneToMany(mappedBy = "registeredEvent", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonBackReference
    private List<EventImage> eventImages;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<EventImage> getEventImages() {
        return eventImages;
    }

    public void setEventImages(List<EventImage> eventImages) {
        this.eventImages = eventImages;
    }

    public EventTypes getEventType() {
        return eventType;
    }

    public void setEventType(EventTypes eventType) {
        this.eventType = eventType;
    }

    public String getDiscription() {
        return discription;
    }

    public void setDiscription(String discription) {
        this.discription = discription;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getDateOfEvent() {
        return dateOfEvent;
    }

    public void setDateOfEvent(String dateOfEvent) {
        this.dateOfEvent = dateOfEvent;
    }

    public String getSeats() {
        return seats;
    }

    public void setSeats(String seats) {
        this.seats = seats;
    }

    public String getEstimatedPrice() {
        return estimatedPrice;
    }

    public void setEstimatedPrice(String estimatedPrice) {
        this.estimatedPrice = estimatedPrice;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Manager getManager() {
        return manager;
    }

    public void setManager(Manager manager) {
        this.manager = manager;
    }

    public String getTask() {
        return task;
    }

    public void setTask(String task) {
        this.task = task;
    }
}
