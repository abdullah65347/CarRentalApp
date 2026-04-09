package com.example.carrental.controller;

import com.example.carrental.service.AvailabilityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.OffsetDateTime;
import java.util.List;
@RestController
@RequestMapping("/api/availability")
public class AvailabilityController {

     private final AvailabilityService availabilityService;

     public AvailabilityController(AvailabilityService availabilityService) {
          this.availabilityService = availabilityService;
     }

     @GetMapping("/check")
     public ResponseEntity<Boolean> checkAvailability(
             @RequestParam String carId,
             @RequestParam OffsetDateTime start,
             @RequestParam OffsetDateTime end) {

          boolean available = availabilityService.isCarAvailable(carId, start, end);
          return ResponseEntity.ok(available);
     }

     @GetMapping("/cars")
     public ResponseEntity<List<String>> getAvailableCars(
             @RequestParam OffsetDateTime start,
             @RequestParam OffsetDateTime end) {

          List<String> availableCarIds =
                  availabilityService.getAvailableCarIds(start, end);

          return ResponseEntity.ok(availableCarIds);
     }

}