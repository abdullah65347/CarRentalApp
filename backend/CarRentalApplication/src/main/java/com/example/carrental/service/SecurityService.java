package com.example.carrental.service;

import com.example.carrental.model.Car;
import com.example.carrental.model.User;
import com.example.carrental.repository.BookingRepository;
import com.example.carrental.repository.CarRepository;
import com.example.carrental.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * Helper service exposing security-related checks for use in @PreAuthorize SpEL.
 * Methods must be public to be accessible from SpEL.
 */
@Service("securityService")
public class SecurityService {

     private final UserRepository userRepository;
     private final CarRepository carRepository;
     private final BookingRepository bookingRepository;

     public SecurityService(UserRepository userRepository,
                            CarRepository carRepository,
                            BookingRepository bookingRepository) {
          this.userRepository = userRepository;
          this.carRepository = carRepository;
          this.bookingRepository = bookingRepository;
     }

     /**
      * Returns current authenticated user's id or null.
      */
     public Long currentUserId() {
          Authentication auth = SecurityContextHolder.getContext().getAuthentication();
          if (auth == null || !(auth.getPrincipal() instanceof org.springframework.security.core.userdetails.User)) {
               return null;
          }
          String email = ((org.springframework.security.core.userdetails.User) auth.getPrincipal()).getUsername();
          Optional<User> u = userRepository.findByEmail(email);
          return u.map(User::getId).orElse(null);
     }

     public boolean isCurrentUserAdmin() {
          Authentication auth = SecurityContextHolder.getContext().getAuthentication();
          if (auth == null) return false;

          return auth.getAuthorities().stream()
                  .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
     }

     public boolean isReviewOwner(Long reviewUserId) {
          Long current = currentUserId();
          return current != null && current.equals(reviewUserId);
     }


     /**
      * True if current user is owner of the given car id.
      */
     public boolean isCarOwner(Long carId) {
          Long uid = currentUserId();
          if (uid == null || carId == null) return false;
          Optional<Car> c = carRepository.findById(carId);
          return c.map(car -> car.getOwner() != null && uid.equals(car.getOwner().getId())).orElse(false);
     }

     /**
      * True if current user owns the booking (booking->user).
      * Useful if you want to restrict booking cancel/confirm to owner or admin.
      */
     public boolean isBookingOwner(Long bookingId) {
          Long uid = currentUserId();
          if (uid == null || bookingId == null) return false;
          return bookingRepository.findById(bookingId).map(b -> b.getUser() != null && uid.equals(b.getUser().getId())).orElse(false);
     }
}
