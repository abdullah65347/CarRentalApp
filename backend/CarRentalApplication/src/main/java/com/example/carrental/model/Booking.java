package com.example.carrental.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Entity
@Table(name = "bookings",
        indexes = {
                @Index(name = "idx_booking_car_start_end", columnList = "car_id,start_datetime,end_datetime")
        })
@Setter
@Getter
public class Booking {
     @Id
     @GeneratedValue(strategy = GenerationType.IDENTITY)
     private Long id;

     @ManyToOne
     @JoinColumn(name = "user_id", nullable = false)
     private com.example.carrental.model.User user;

     @ManyToOne
     @JoinColumn(name = "car_id", nullable = false)
     private Car car;

     @ManyToOne
     @JoinColumn(name = "pickup_location_id")
     private Location pickupLocation;

     @ManyToOne
     @JoinColumn(name = "dropoff_location_id")
     private Location dropoffLocation;

     @Column(name = "start_datetime", nullable = false)
     private OffsetDateTime startDatetime;

     @Column(name = "end_datetime", nullable = false)
     private OffsetDateTime endDatetime;

     private Double totalPrice;

     private String status; // PENDING, CONFIRMED, CANCELLED, COMPLETED, FAILED

     private String cancellationReason;

     @Column(name = "created_at")
     private OffsetDateTime createdAt = OffsetDateTime.now();

}
