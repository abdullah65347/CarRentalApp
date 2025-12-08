package com.example.carrental.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CarResponse {
     private Long id;
     private Long ownerId;
     private String make;
     private String model;
     private Integer year;
     private String plateNumber;
     private Integer seats;
     private String carType;
     private String transmission;
     private String fuelType;
     private Double pricePerDay;
     private String description;
     private Long locationId;
     private String status;
}
