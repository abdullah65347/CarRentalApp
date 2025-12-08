package com.example.carrental.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Entity
@Table(name = "availability",
        indexes = {@Index(name = "idx_avail_car_start_end", columnList = "car_id,start_datetime,end_datetime")})
@Setter
@Getter
public class Availability {
     @Id
     @GeneratedValue(strategy = GenerationType.IDENTITY)
     private Long id;

     @ManyToOne
     @JoinColumn(name = "car_id")
     private Car car;

     @Column(name = "start_datetime", nullable = false)
     private OffsetDateTime startDatetime;

     @Column(name = "end_datetime", nullable = false)
     private OffsetDateTime endDatetime;

     @Column(name = "available_flag")
     private Boolean availableFlag = true;

}
