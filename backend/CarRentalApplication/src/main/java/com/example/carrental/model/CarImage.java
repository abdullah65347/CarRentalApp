package com.example.carrental.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Entity
@Table(name = "car_images")
@Getter
@Setter
@JsonIgnoreProperties({"car"})
public class CarImage {
     @Id
     @GeneratedValue(strategy = GenerationType.IDENTITY)
     private Long id;

     private String url;
     private Boolean isPrimary = false;
     private OffsetDateTime uploadedAt = OffsetDateTime.now();

     @JsonIgnoreProperties({"car"})
     @ManyToOne(fetch = FetchType.LAZY)
     @JoinColumn(name = "car_id")
     private Car car;
}
