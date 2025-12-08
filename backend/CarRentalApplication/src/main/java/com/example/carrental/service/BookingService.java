package com.example.carrental.service;

import com.example.carrental.dto.BookingResponse;
import com.example.carrental.dto.CreateBookingRequest;
import com.example.carrental.exception.BookingConflictException;
import com.example.carrental.model.Booking;
import com.example.carrental.model.Car;
import com.example.carrental.model.Location;
import com.example.carrental.model.User;
import com.example.carrental.repository.BookingRepository;
import com.example.carrental.repository.CarRepository;
import com.example.carrental.repository.LocationRepository;
import com.example.carrental.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.OffsetDateTime;
import java.util.Arrays;
import java.util.List;

@Service
public class BookingService {

     private final BookingRepository bookingRepository;
     private final CarRepository carRepository;
     private final UserRepository userRepository;
     private final LocationRepository locationRepository;

     public BookingService(BookingRepository bookingRepository, CarRepository carRepository,
                           UserRepository userRepository, LocationRepository locationRepository) {
          this.bookingRepository = bookingRepository;
          this.carRepository = carRepository;
          this.userRepository = userRepository;
          this.locationRepository = locationRepository;
     }

     /**
      * Create a booking transactionally. Uses pessimistic lock on the car row (if supported by JPA provider / DB)
      * to reduce double-booking risk.
      */
     @Transactional
     public BookingResponse createBooking(CreateBookingRequest req) {
          if (req.getStartDatetime() == null || req.getEndDatetime() == null) {
               throw new IllegalArgumentException("Start and end datetime must be provided");
          }
          if (!req.getStartDatetime().isBefore(req.getEndDatetime())) {
               throw new IllegalArgumentException("Start datetime must be before end datetime");
          }

          // Acquire lock on car row (uses CarRepository.findByIdForUpdate if available)
          Car car;
          try {
               car = carRepository.findByIdForUpdate(req.getCarId())
                       .orElseThrow(() -> new IllegalArgumentException("Car not found with id: " + req.getCarId()));
          } catch (NoSuchMethodError | UnsupportedOperationException ex) {
               // fallback if repository doesn't support findByIdForUpdate
               car = carRepository.findById(req.getCarId())
                       .orElseThrow(() -> new IllegalArgumentException("Car not found with id: " + req.getCarId()));
          }

          Location pickup = locationRepository.findById(req.getPickupLocationId())
                  .orElseThrow(() -> new IllegalArgumentException("Pickup location not found"));
          Location dropoff = locationRepository.findById(req.getDropoffLocationId())
                  .orElseThrow(() -> new IllegalArgumentException("Dropoff location not found"));

          // Check overlap while holding lock
          List<String> blockingStatuses = Arrays.asList("CONFIRMED", "PENDING");
          boolean existsOverlap = bookingRepository.existsOverlappingBooking(car.getId(), req.getStartDatetime(), req.getEndDatetime(), blockingStatuses);
          if (existsOverlap) {
               throw new BookingConflictException("Car is already booked for the selected time range");
          }

          // get current user from security context (assumes username = email)
          Authentication auth = SecurityContextHolder.getContext().getAuthentication();
          if (auth == null || !(auth.getPrincipal() instanceof UserDetails)) {
               throw new IllegalStateException("Unable to determine authenticated user");
          }
          String email = ((UserDetails) auth.getPrincipal()).getUsername();
          User user = userRepository.findByEmail(email)
                  .orElseThrow(() -> new IllegalStateException("Authenticated user not found in DB"));

          // calculate total price (simple day-based calculation)
          long hours = Duration.between(req.getStartDatetime(), req.getEndDatetime()).toHours();
          if (hours <= 0) hours = 24;
          double days = Math.ceil(hours / 24.0);
          double pricePerDay = (car.getPricePerDay() != null) ? car.getPricePerDay() : 0.0;
          double totalPrice = pricePerDay * days;

          Booking booking = new Booking();
          booking.setCar(car);
          booking.setUser(user);
          booking.setPickupLocation(pickup);
          booking.setDropoffLocation(dropoff);
          booking.setStartDatetime(req.getStartDatetime());
          booking.setEndDatetime(req.getEndDatetime());
          booking.setTotalPrice(totalPrice);
          booking.setStatus("PENDING"); // initial

          Booking saved = bookingRepository.save(booking);

          return mapToResponse(saved);
     }

     /**
      * Confirm a booking (e.g., after payment). Changes status to CONFIRMED if currently PENDING and no overlap exists.
      */
     @Transactional
     public BookingResponse confirmBooking(Long bookingId) {
          Booking b = bookingRepository.findById(bookingId)
                  .orElseThrow(() -> new IllegalArgumentException("Booking not found: " + bookingId));

          if ("CONFIRMED".equalsIgnoreCase(b.getStatus())) {
               return mapToResponse(b);
          }
          if ("CANCELLED".equalsIgnoreCase(b.getStatus())) {
               throw new IllegalStateException("Cannot confirm a cancelled booking");
          }

          // lock car row before confirming
          Car car;
          try {
               car = carRepository.findByIdForUpdate(b.getCar().getId())
                       .orElseThrow(() -> new IllegalStateException("Car not found"));
          } catch (NoSuchMethodError | UnsupportedOperationException ex) {
               car = carRepository.findById(b.getCar().getId())
                       .orElseThrow(() -> new IllegalStateException("Car not found"));
          }

          // ensure no overlapping confirmed bookings (excluding current booking)
          List<String> blockingStatuses = Arrays.asList("CONFIRMED");
          boolean overlap = bookingRepository.existsOverlappingBooking(car.getId(), b.getStartDatetime(), b.getEndDatetime(), blockingStatuses);
          if (overlap) {
               throw new BookingConflictException("Cannot confirm booking — overlapping confirmed booking exists");
          }

          b.setStatus("CONFIRMED");
          Booking saved = bookingRepository.save(b);
          return mapToResponse(saved);
     }

     /**
      * Cancel a booking.
      */
     @Transactional
     public BookingResponse cancelBooking(Long bookingId, String reason) {
          Booking b = bookingRepository.findById(bookingId)
                  .orElseThrow(() -> new IllegalArgumentException("Booking not found: " + bookingId));

          if ("CANCELLED".equalsIgnoreCase(b.getStatus())) {
               return mapToResponse(b);
          }

          b.setStatus("CANCELLED");
          b.setCancellationReason(reason);
          Booking saved = bookingRepository.save(b);
          return mapToResponse(saved);
     }

     private BookingResponse mapToResponse(Booking saved) {
          BookingResponse resp = new BookingResponse();
          resp.setId(saved.getId());
          resp.setCarId(saved.getCar() != null ? saved.getCar().getId() : null);
          resp.setUserId(saved.getUser() != null ? saved.getUser().getId() : null);
          resp.setStartDatetime(saved.getStartDatetime());
          resp.setEndDatetime(saved.getEndDatetime());
          resp.setTotalPrice(saved.getTotalPrice());
          resp.setStatus(saved.getStatus());
          return resp;
     }
}
