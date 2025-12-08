package com.example.carrental.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Entity
@Table(name = "reviews",
        indexes = {@Index(name = "idx_review_car", columnList = "car_id")})
@Setter
@Getter
public class Review {
     @Id
     @GeneratedValue(strategy = GenerationType.IDENTITY)
     private Long id;

     private Integer rating; // 1-5
     private String comment;

     @Column(name = "created_at")
     private OffsetDateTime createdAt = OffsetDateTime.now();

     @ManyToOne
     @JoinColumn(name = "user_id")
     private com.example.carrental.model.User user;

     @ManyToOne
     @JoinColumn(name = "car_id")
     private Car car;

}
