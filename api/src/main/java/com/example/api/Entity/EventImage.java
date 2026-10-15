package com.example.api.Entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

@Entity
public class EventImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob
    @Column(name = "image", columnDefinition = "LONGBLOB") // or BLOB, , etc.
    private byte[] image;

    // Foreign key to RegisteredEvent
    @ManyToOne
    @JoinColumn(name = "register_event_id", nullable = false)
    @JsonManagedReference
    private RegisterEvents registeredEvent;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public byte[] getImage() {
        return image;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public RegisterEvents getRegisteredEvent() {
        return registeredEvent;
    }

    public void setRegisteredEvent(RegisterEvents registeredEvent) {
        this.registeredEvent = registeredEvent;
    }
}
