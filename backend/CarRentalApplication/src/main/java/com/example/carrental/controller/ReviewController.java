package com.example.carrental.controller;

import com.example.carrental.dto.CreateReviewRequest;
import com.example.carrental.dto.ReviewResponse;
import com.example.carrental.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
public class ReviewController {

     private final ReviewService reviewService;

     public ReviewController(ReviewService reviewService) { this.reviewService = reviewService; }

     @PostMapping("/api/cars/{carId}/reviews")
     public ResponseEntity<ReviewResponse> createReview(@PathVariable("carId") Long carId,
                                                        @Valid @RequestBody CreateReviewRequest req) {
          ReviewResponse resp = reviewService.createReview(carId, req);
          return ResponseEntity.status(201).body(resp);
     }

     @GetMapping("/api/cars/{carId}/reviews")
     public ResponseEntity<Page<ReviewResponse>> listReviews(@PathVariable("carId") Long carId,
                                                             @RequestParam(value = "page", defaultValue = "0") int page,
                                                             @RequestParam(value = "size", defaultValue = "10") int size) {
          PageRequest pr = PageRequest.of(page, size);
          Page<ReviewResponse> p = reviewService.listReviews(carId, pr);
          return ResponseEntity.ok(p);
     }

     // delete review: allow admin or owner (checked in service), so annotate to require auth
     @PreAuthorize("hasRole('ROLE_ADMIN') or @securityService.isReviewOwner(#id)")
     @DeleteMapping("/api/reviews/{id}")
     public ResponseEntity<Map<String, Object>> deleteReview(@PathVariable("id") Long id) {
          reviewService.deleteReview(id); // service should throw if not allowed
          return ResponseEntity.ok(Map.of(
                  "message", "Review deleted successfully",
                  "reviewId", id
          ));
     }

}
