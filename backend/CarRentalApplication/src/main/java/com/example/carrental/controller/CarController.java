package com.example.carrental.controller;

import com.example.carrental.dto.CarResponse;
import com.example.carrental.dto.CreateCarRequest;
import com.example.carrental.service.CarService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cars")
public class CarController {

     private final CarService carService;

     public CarController(CarService carService) { this.carService = carService; }

     // Only owners and admins can create car listings
     @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_OWNER')")
     @PostMapping
     public ResponseEntity<CarResponse> createCar(@Valid @RequestBody CreateCarRequest req) {
          CarResponse resp = carService.createCar(req);
          return ResponseEntity.status(201).body(resp);
     }

     // Owners (of the car) or admins can update a car
     @PreAuthorize("hasRole('ROLE_ADMIN') or @securityService.isCarOwner(#id)")
     @PutMapping("/{id}")
     public ResponseEntity<CarResponse> updateCar(@PathVariable("id") Long id, @Valid @RequestBody CreateCarRequest req) {
          CarResponse resp = carService.updateCar(id, req);
          return ResponseEntity.ok(resp);
     }

     @GetMapping("/{id}")
     public ResponseEntity<CarResponse> getCar(@PathVariable("id") Long id) {
          CarResponse resp = carService.getCar(id);
          return ResponseEntity.ok(resp);
     }

     @GetMapping
     public ResponseEntity<Page<CarResponse>> listCars(
             @RequestParam(value = "city", required = false) String city,
             @RequestParam(value = "minPrice", required = false) Double minPrice,
             @RequestParam(value = "maxPrice", required = false) Double maxPrice,
             @RequestParam(value = "seats", required = false) Integer seats,
             @RequestParam(value = "carType", required = false) String carType,
             @RequestParam(value = "page", defaultValue = "0") int page,
             @RequestParam(value = "size", defaultValue = "10") int size
     ) {
          Pageable pageable = PageRequest.of(page, size);
          Page<CarResponse> resp = carService.listCars(city, minPrice, maxPrice, seats, carType, pageable);
          return ResponseEntity.ok(resp);
     }
}
