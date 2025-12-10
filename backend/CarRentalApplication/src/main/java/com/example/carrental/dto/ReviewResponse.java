package com.example.carrental.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Setter
@Getter
public class ReviewResponse {
     private String id;
     private String carId;
     private Long userId;
     private Integer rating;
     private String comment;
     private OffsetDateTime createdAt;
     private String userName;

}