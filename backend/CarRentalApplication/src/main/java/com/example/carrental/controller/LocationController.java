package com.example.carrental.controller;

import com.example.carrental.model.Location;
import com.example.carrental.repository.LocationRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
public class LocationController {

     private final LocationRepository locationRepository;

     public LocationController(LocationRepository locationRepository) { this.locationRepository = locationRepository; }

     @GetMapping
     public ResponseEntity<List<Location>> listLocations(@RequestParam(value = "city", required = false) String city) {
          if (city == null) {
               return ResponseEntity.ok(locationRepository.findAll());
          } else {
               // simple in-memory filter — implement a repository query if needed
               List<Location> all = locationRepository.findAll();
               var filtered = all.stream().filter(l -> city.equalsIgnoreCase(l.getCity())).toList();
               return ResponseEntity.ok(filtered);
          }
     }

     @PostMapping
     public ResponseEntity<Location> createLocation(@Valid @RequestBody Location loc) {
          Location saved = locationRepository.save(loc);
          return ResponseEntity.status(201).body(saved);
     }

     @GetMapping("/{id}")
     public ResponseEntity<Location> getLocation(@PathVariable("id") String id) {
          Location loc = locationRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Location not found"));
          return ResponseEntity.ok(loc);
     }
}
