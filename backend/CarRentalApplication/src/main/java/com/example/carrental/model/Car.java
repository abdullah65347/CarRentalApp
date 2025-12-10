package com.example.carrental.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cars")
@Getter
@Setter
@NoArgsConstructor
public class Car {
     @Id
     @Column(name = "id", nullable = false, unique = true)
     private String id;

     // optional owner (if implementing multi-owner listings later)
     @ManyToOne(fetch = FetchType.LAZY)
     @JoinColumn(name = "owner_id")
     private com.example.carrental.model.User owner;

     private String make;
     private String model;
     private Integer year;
     private String plateNumber;
     private Integer seats;
     private String carType; // e.g., SUV, SEDAN
     private String transmission;
     private String fuelType;
     private Double pricePerDay;
     private String description;
     private String status; // ACTIVE / INACTIVE

     @ManyToOne
     @JoinColumn(name = "location_id")
     private Location location;

     @OneToMany(mappedBy = "car", cascade = CascadeType.ALL, orphanRemoval = true)
     private List<CarImage> images = new ArrayList<>();
}
