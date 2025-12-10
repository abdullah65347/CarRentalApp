package com.example.carrental.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CreateCarRequest {
     private Long ownerId;

     @Size(max = 100)
     private String make;

     @Size(max = 100)
     private String model;

     private Integer year;

     @Size(max = 100)
     private String plateNumber;

     private Integer seats;

     @Size(max = 50)
     private String carType;

     @Size(max = 50)
     private String transmission;

     @Size(max = 50)
     private String fuelType;

     @Positive
     private Double pricePerDay;

     @Size(max = 2000)
     private String description;

     @NotNull
     private String locationId;

     @Size(max = 50)
     private String status; // ACTIVE / INACTIVE

     }