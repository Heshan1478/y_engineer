package com.example.y_eng_backend.controller;

import com.example.y_eng_backend.entity.RepairRequest;
import com.example.y_eng_backend.service.RepairRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/repairs")
@CrossOrigin(origins = "http://localhost:3000") // Allow React frontend
public class RepairRequestController {

    @Autowired
    private RepairRequestService repairRequestService;

    // Create new repair request
    @PostMapping
    public ResponseEntity<RepairRequest> createRepairRequest(@RequestBody RepairRequest repairRequest) {
        try {
            RepairRequest created = repairRequestService.createRepairRequest(repairRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get all repair requests for a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<RepairRequest>> getUserRepairs(@PathVariable UUID userId) {
        List<RepairRequest> repairs = repairRequestService.getUserRepairRequests(userId);
        return ResponseEntity.ok(repairs);
    }

    // Get repair request by ID
    @GetMapping("/{id}")
    public ResponseEntity<RepairRequest> getRepairById(@PathVariable UUID id) {
        return repairRequestService.getRepairRequestById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get all repair requests (admin only - add security later)
    @GetMapping
    public ResponseEntity<List<RepairRequest>> getAllRepairs() {
        List<RepairRequest> repairs = repairRequestService.getAllRepairRequests();
        return ResponseEntity.ok(repairs);
    }

    // Get repairs by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<RepairRequest>> getRepairsByStatus(@PathVariable String status) {
        List<RepairRequest> repairs = repairRequestService.getRepairsByStatus(status);
        return ResponseEntity.ok(repairs);
    }

    // Update repair status (admin only - add security later)
    @PatchMapping("/{id}/status")
    public ResponseEntity<RepairRequest> updateRepairStatus(
            @PathVariable UUID id,
            @RequestBody Map<String, String> updates) {
        try {
            String status = updates.get("status");
            String adminNotes = updates.get("adminNotes");
            RepairRequest updated = repairRequestService.updateRepairStatus(id, status, adminNotes);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Update entire repair request
    @PutMapping("/{id}")
    public ResponseEntity<RepairRequest> updateRepairRequest(
            @PathVariable UUID id,
            @RequestBody RepairRequest repairRequest) {
        try {
            RepairRequest updated = repairRequestService.updateRepairRequest(id, repairRequest);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete repair request
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRepairRequest(@PathVariable UUID id) {
        repairRequestService.deleteRepairRequest(id);
        return ResponseEntity.noContent().build();
    }
}