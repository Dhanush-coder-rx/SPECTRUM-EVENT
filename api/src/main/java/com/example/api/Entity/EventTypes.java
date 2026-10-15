package com.example.api.Entity;

import jakarta.persistence.*;

import java.util.List;

@Entity
public class EventTypes {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String eTypes;

    @OneToMany(mappedBy = "eventType", cascade = CascadeType.ALL)
    private List<RegisterEvents> registeredEvents;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String geteTypes() {
        return eTypes;
    }

    public void seteTypes(String eTypes) {
        this.eTypes = eTypes;
    }
}
