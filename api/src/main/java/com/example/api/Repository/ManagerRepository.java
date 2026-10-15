package com.example.api.Repository;

import com.example.api.Entity.Manager;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ManagerRepository extends JpaRepository<Manager , Long> {
    Optional<Manager> findByEmail(String email);
}
