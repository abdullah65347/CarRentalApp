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
     private Long carId;

     @NotNull
     private Long pickupLocationId;

     @NotNull
     private Long dropoffLocationId;

     @NotNull
     private OffsetDateTime startDatetime;

     @NotNull
     private OffsetDateTime endDatetime;

}