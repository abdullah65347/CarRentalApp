package com.example.carrental.dto;


import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Getter
@Setter
public class BookingResponse {
     private String id;
     private OffsetDateTime startDatetime;
     private OffsetDateTime endDatetime;
     private Double totalPrice;
     private String status;
     private CarSummaryDto car;
     private UserSummaryDto user;
}