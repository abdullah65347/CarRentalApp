package com.example.carrental.controller;

import com.example.carrental.dto.CarResponse;
import com.example.carrental.dto.CreateCarRequest;
import com.example.carrental.service.CarService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cars")
public class CarController {

     private final CarService carService;

     public CarController(CarService carService) {
          this.carService = carService;
     }
     /* add new car (ADMIN & OWNER only)   */
     @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_OWNER')")
     @PostMapping
     public ResponseEntity<CarResponse> createCar(@Valid @RequestBody CreateCarRequest req) {
          return ResponseEntity.status(201).body(carService.createCar(req));
     }

     /* update car details(ADMIN & OWNER only)   */
     @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_OWNER')")
     @PutMapping("/{id}")
     public ResponseEntity<CarResponse> updateCar(
             @PathVariable String id,
             @Valid @RequestBody CreateCarRequest req) {
          return ResponseEntity.ok(carService.updateCar(id, req));
     }

     /* get all owner cars (OWNER only)   */
     @PreAuthorize("hasRole('ROLE_OWNER')")
     @GetMapping("/my")
     public ResponseEntity<List<CarResponse>> listMyCars() {
          return ResponseEntity.ok(carService.getCarsByCurrentOwner());
     }

     /* get car by carId    */
     @GetMapping("/{id}")
     public ResponseEntity<CarResponse> getCar(@PathVariable String id) {
          return ResponseEntity.ok(carService.getCar(id));
     }

     /* get all cars   */
     @GetMapping
     public ResponseEntity<List<CarResponse>> listCars(
             @RequestParam(required = false) String city,
             @RequestParam(required = false) Double minPrice,
             @RequestParam(required = false) Double maxPrice,
             @RequestParam(required = false) Integer seats,
             @RequestParam(required = false) String carType) {

          return ResponseEntity.ok(
                  carService.listCars(city, minPrice, maxPrice, seats, carType)
          );
     }
}
