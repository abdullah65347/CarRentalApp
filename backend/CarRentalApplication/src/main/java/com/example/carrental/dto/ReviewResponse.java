package com.example.carrental.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Setter
@Getter
public class ReviewResponse {
     private Long id;
     private Long carId;
     private Long userId;
     private Integer rating;
     private String comment;
     private OffsetDateTime createdAt;
     private String userName;

}