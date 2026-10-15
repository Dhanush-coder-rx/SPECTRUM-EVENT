package com.example.api.Repository;

import com.example.api.Entity.EventImage;
import com.example.api.Entity.RegisterEvents;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventImageRepository extends JpaRepository<EventImage , Long> {

    List<EventImage> findByRegisteredEvent(RegisterEvents registeredEvent);


}
