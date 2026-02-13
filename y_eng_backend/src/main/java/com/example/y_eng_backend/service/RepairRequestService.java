package com.example.y_eng_backend.service;

import com.example.y_eng_backend.entity.RepairRequest;
import com.example.y_eng_backend.repository.RepairRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class RepairRequestService {

    @Autowired
    private RepairRequestRepository repairRequestRepository;

    // Create new repair request
    public RepairRequest createRepairRequest(RepairRequest repairRequest) {
        return repairRequestRepository.save(repairRequest);
    }

    // Get all repair requests for a user
    public List<RepairRequest> getUserRepairRequests(UUID userId) {
        return repairRequestRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    // Get repair request by ID
    public Optional<RepairRequest> getRepairRequestById(UUID id) {
        return repairRequestRepository.findById(id);
    }

    // Get all repair requests (admin)
    public List<RepairRequest> getAllRepairRequests() {
        return repairRequestRepository.findAllByOrderByCreatedAtDesc();
    }

    // Get repairs by status
    public List<RepairRequest> getRepairsByStatus(String status) {
        return repairRequestRepository.findByStatus(status);
    }

    // Update repair request status (admin)
    public RepairRequest updateRepairStatus(UUID id, String status, String adminNotes) {
        Optional<RepairRequest> optionalRepair = repairRequestRepository.findById(id);
        if (optionalRepair.isPresent()) {
            RepairRequest repair = optionalRepair.get();
            repair.setStatus(status);
            if (adminNotes != null && !adminNotes.isEmpty()) {
                repair.setAdminNotes(adminNotes);
            }
            return repairRequestRepository.save(repair);
        }
        throw new RuntimeException("Repair request not found with id: " + id);
    }

    // Update entire repair request
    public RepairRequest updateRepairRequest(UUID id, RepairRequest updatedRepair) {
        Optional<RepairRequest> optionalRepair = repairRequestRepository.findById(id);
        if (optionalRepair.isPresent()) {
            RepairRequest repair = optionalRepair.get();

            // Update fields
            if (updatedRepair.getEquipmentType() != null) {
                repair.setEquipmentType(updatedRepair.getEquipmentType());
            }
            if (updatedRepair.getBrand() != null) {
                repair.setBrand(updatedRepair.getBrand());
            }
            if (updatedRepair.getIssueDescription() != null) {
                repair.setIssueDescription(updatedRepair.getIssueDescription());
            }
            if (updatedRepair.getUrgency() != null) {
                repair.setUrgency(updatedRepair.getUrgency());
            }
            if (updatedRepair.getServiceType() != null) {
                repair.setServiceType(updatedRepair.getServiceType());
            }
            if (updatedRepair.getPickupAddress() != null) {
                repair.setPickupAddress(updatedRepair.getPickupAddress());
            }
            if (updatedRepair.getPreferredDate() != null) {
                repair.setPreferredDate(updatedRepair.getPreferredDate());
            }
            if (updatedRepair.getPreferredTime() != null) {
                repair.setPreferredTime(updatedRepair.getPreferredTime());
            }
            if (updatedRepair.getEstimatedCost() != null) {
                repair.setEstimatedCost(updatedRepair.getEstimatedCost());
            }

            return repairRequestRepository.save(repair);
        }
        throw new RuntimeException("Repair request not found with id: " + id);
    }

    // Delete repair request
    public void deleteRepairRequest(UUID id) {
        repairRequestRepository.deleteById(id);
    }
}