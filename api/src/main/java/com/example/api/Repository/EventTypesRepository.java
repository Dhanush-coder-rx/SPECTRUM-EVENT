package com.example.api.Repository;

import com.example.api.Entity.EventTypes;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EventTypesRepository extends JpaRepository<EventTypes,Long> {


    boolean existsByETypes(String eTypes);
}
