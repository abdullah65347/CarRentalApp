package com.example.carrental.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Entity
@Table(name = "car_images")
@Getter
@Setter
public class CarImage {
     @Id
     @GeneratedValue(strategy = GenerationType.IDENTITY)
     private Long id;

     private String url;
     private Boolean isPrimary = false;
     private OffsetDateTime uploadedAt = OffsetDateTime.now();

     @ManyToOne(fetch = FetchType.LAZY)
     @JoinColumn(name = "car_id")
     private Car car;
}
