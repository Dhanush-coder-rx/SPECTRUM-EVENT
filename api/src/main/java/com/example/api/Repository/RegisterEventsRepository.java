package com.example.api.Repository;

import com.example.api.Entity.EventTypes;
import com.example.api.Entity.RegisterEvents;
import com.example.api.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RegisterEventsRepository extends JpaRepository<RegisterEvents ,Long> {
    List<RegisterEvents> findByStatus(String status);
    List<RegisterEvents> findByUser(User user);
    @Query("SELECT e FROM RegisterEvents e WHERE e.user.email = :email")
    List<RegisterEvents> findByUserEmail(@Param("email") String email);

    List<RegisterEvents> findByManagerIsNotNull();

    List<RegisterEvents> findByManagerEmail(String email);

    List<RegisterEvents> findByEventType(EventTypes eventType);

}
