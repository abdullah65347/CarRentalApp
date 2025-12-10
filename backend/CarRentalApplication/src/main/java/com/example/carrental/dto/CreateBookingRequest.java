package com.example.carrental.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;

@Setter
@Getter
@NoArgsConstructor
public class CreateBookingRequest {
     @NotNull
     private String carId;

     @NotNull
     private String pickupLocationId;

     @NotNull
     private String dropoffLocationId;

     @NotNull
     private OffsetDateTime startDatetime;

     @NotNull
     private OffsetDateTime endDatetime;

}