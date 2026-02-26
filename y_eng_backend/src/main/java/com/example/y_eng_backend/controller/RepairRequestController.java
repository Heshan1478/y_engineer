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
@RequestMapping("/api/repair-requests")  // ✅ FIXED: Changed from /api/repairs
@CrossOrigin(origins = "http://localhost:3000")
public class RepairRequestController {

    @Autowired
    private RepairRequestService repairRequestService;

    // Create new repair request
    @PostMapping
    public ResponseEntity<RepairRequest> createRepairRequest(@RequestBody RepairRequest repairRequest) {
        try {
            System.out.println("📝 Creating repair request: " + repairRequest.getEquipmentType());
            RepairRequest created = repairRequestService.createRepairRequest(repairRequest);
            System.out.println("✅ Repair request created with ID: " + created.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            System.err.println("❌ Error creating repair request: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get all repair requests for a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<RepairRequest>> getUserRepairs(@PathVariable String userId) {  // ✅ Changed to String
        try {
            System.out.println("📋 Fetching repairs for user: " + userId);
            List<RepairRequest> repairs = repairRequestService.getUserRepairRequests(UUID.fromString(userId));
            System.out.println("✅ Found " + repairs.size() + " repairs");
            return ResponseEntity.ok(repairs);
        } catch (Exception e) {
            System.err.println("❌ Error fetching user repairs: " + e.getMessage());
            return ResponseEntity.ok(List.of());  // Return empty list instead of error
        }
    }

    // Get repair request by ID
    @GetMapping("/{id}")
    public ResponseEntity<RepairRequest> getRepairById(@PathVariable String id) {  // ✅ Changed to String
        try {
            return repairRequestService.getRepairRequestById(UUID.fromString(id))
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Get all repair requests (admin only)
    @GetMapping
    public ResponseEntity<List<RepairRequest>> getAllRepairs() {
        try {
            System.out.println("📋 Fetching all repair requests...");
            List<RepairRequest> repairs = repairRequestService.getAllRepairRequests();
            System.out.println("✅ Found " + repairs.size() + " total repairs");
            return ResponseEntity.ok(repairs);
        } catch (Exception e) {
            System.err.println("❌ Error fetching all repairs: " + e.getMessage());
            return ResponseEntity.ok(List.of());  // Return empty list
        }
    }

    // Get repairs by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<RepairRequest>> getRepairsByStatus(@PathVariable String status) {
        try {
            List<RepairRequest> repairs = repairRequestService.getRepairsByStatus(status);
            return ResponseEntity.ok(repairs);
        } catch (Exception e) {
            return ResponseEntity.ok(List.of());
        }
    }

    // Update repair status (admin only)
    @PatchMapping("/{id}/status")
    public ResponseEntity<RepairRequest> updateRepairStatus(
            @PathVariable String id,  // ✅ Changed to String
            @RequestBody Map<String, String> updates) {
        try {
            String status = updates.get("status");
            String adminNotes = updates.get("adminNotes");
            System.out.println("🔄 Updating repair " + id + " to status: " + status);
            RepairRequest updated = repairRequestService.updateRepairStatus(UUID.fromString(id), status, adminNotes);
            System.out.println("✅ Repair status updated");
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            System.err.println("❌ Error updating repair status: " + e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    // Update entire repair request
    @PutMapping("/{id}")
    public ResponseEntity<RepairRequest> updateRepairRequest(
            @PathVariable String id,  // ✅ Changed to String
            @RequestBody RepairRequest repairRequest) {
        try {
            RepairRequest updated = repairRequestService.updateRepairRequest(UUID.fromString(id), repairRequest);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete repair request
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRepairRequest(@PathVariable String id) {  // ✅ Changed to String
        try {
            repairRequestService.deleteRepairRequest(UUID.fromString(id));
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}