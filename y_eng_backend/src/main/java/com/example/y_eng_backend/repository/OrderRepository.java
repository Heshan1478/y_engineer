package com.example.y_eng_backend.repository;

import com.example.y_eng_backend.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdOrderByCreatedAtDesc(UUID userId);
    List<Order> findAllByOrderByCreatedAtDesc();
    List<Order> findByStatus(String status);
}