package com.example.y_eng_backend.repository;

import com.example.y_eng_backend.entity.RepairRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RepairRequestRepository extends JpaRepository<RepairRequest, UUID> {

    // Find all repairs by user
    List<RepairRequest> findByUserIdOrderByCreatedAtDesc(UUID userId);

    // Find repairs by status
    List<RepairRequest> findByStatus(String status);

    // Find repairs by user and status
    List<RepairRequest> findByUserIdAndStatus(UUID userId, String status);

    // Find all repairs ordered by creation date
    List<RepairRequest> findAllByOrderByCreatedAtDesc();
}