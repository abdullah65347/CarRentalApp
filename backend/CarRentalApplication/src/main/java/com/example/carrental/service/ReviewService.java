package com.example.carrental.service;

import com.example.carrental.dto.CreateReviewRequest;
import com.example.carrental.dto.ReviewResponse;
import com.example.carrental.exception.BadRequestException;
import com.example.carrental.exception.ForbiddenException;
import com.example.carrental.exception.ResourceNotFoundException;
import com.example.carrental.model.Review;
import com.example.carrental.model.User;
import com.example.carrental.repository.BookingRepository;
import com.example.carrental.repository.CarRepository;
import com.example.carrental.repository.ReviewRepository;
import com.example.carrental.repository.UserRepository;
import com.example.carrental.util.UniqueIdGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
public class ReviewService {
     @Autowired
     private  SecurityService securityService;

     private final UniqueIdGenerator idGenerator;
     private final ReviewRepository reviewRepository;
     private final UserRepository userRepository;
     private final CarRepository carRepository;
     private final BookingRepository bookingRepository;

     public ReviewService(ReviewRepository reviewRepository,
                          UserRepository userRepository,
                          CarRepository carRepository,
                          BookingRepository bookingRepository,UniqueIdGenerator idGenerator) {
          this.reviewRepository = reviewRepository;
          this.userRepository = userRepository;
          this.carRepository = carRepository;
          this.bookingRepository = bookingRepository;
          this.idGenerator = idGenerator;
     }

     private String generateUniqueBookingId() {
          while (true) {
               String id = idGenerator.generate("REVW");
               if (!bookingRepository.existsById(id)) {
                    return id;
               }
               // Incredibly unlikely to enter retry loop
          }
     }
     /**
      * Create a review. Ensures the authenticated user has at least one COMPLETED booking for this car.
      */
     @Transactional
     public ReviewResponse createReview(String carId, CreateReviewRequest req) {
          // ensure car exists
          carRepository.findById(carId).orElseThrow(() -> new ResourceNotFoundException("Car not found"));

          // get authenticated user
          Authentication auth = SecurityContextHolder.getContext().getAuthentication();
          if (auth == null || !(auth.getPrincipal() instanceof UserDetails)) {
               throw new ForbiddenException("Not authenticated");
          }
          String email = ((UserDetails) auth.getPrincipal()).getUsername();
          User user = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));

          // ensure user had a completed booking for this car
          boolean hadCompleted = bookingRepository.existsByUserIdAndCarIdAndStatus(user.getId(), carId, "COMPLETED");
          if (!hadCompleted) {
               throw new BadRequestException("User can only review after a completed booking");
          }

          Review r = new Review();
          r.setId(generateUniqueBookingId());
          r.setCar(carRepository.findById(carId).get());
          r.setUser(user);
          r.setRating(req.getRating());
          r.setComment(req.getComment());
          Review saved = reviewRepository.save(r);

          return map(saved);
     }

     public Page<ReviewResponse> listReviews(String carId, Pageable pageable) {
          return reviewRepository.findByCarIdOrderByCreatedAtDesc(carId, pageable)
                  .map(this::map);
     }

     @Transactional
     public void deleteReview(String reviewId) {

          Review r = reviewRepository.findById(reviewId)
                  .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

          Long reviewOwnerId = r.getUser().getId();
          Long currentUserId = securityService.currentUserId();
          boolean isAdmin = securityService.isCurrentUserAdmin();

          if (!isAdmin && !currentUserId.equals(reviewOwnerId)) {
               throw new ForbiddenException("Not allowed to delete this review");
          }

          reviewRepository.delete(r);
     }


     private ReviewResponse map(Review r) {
          ReviewResponse resp = new ReviewResponse();
          resp.setId(r.getId());
          resp.setCarId(r.getCar() != null ? r.getCar().getId() : null);
          resp.setUserId(r.getUser() != null ? r.getUser().getId() : null);
          resp.setRating(r.getRating());
          resp.setComment(r.getComment());
          resp.setCreatedAt(r.getCreatedAt());
          resp.setUserName(r.getUser() != null ? r.getUser().getName() : null);
          return resp;
     }
}
