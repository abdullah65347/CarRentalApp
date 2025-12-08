package com.example.carrental.controller;

import com.example.carrental.dto.BookingResponse;
import com.example.carrental.dto.CreateBookingRequest;
import com.example.carrental.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Booking endpoints:
 *  - POST /api/bookings         -> create (PENDING)
 *  - PUT  /api/bookings/{id}/confirm -> confirm (after payment)
 *  - PUT  /api/bookings/{id}/cancel  -> cancel
 *
 * Add @PreAuthorize annotations as needed for role checks.
 */
@RestController
@RequestMapping("/api/bookings")
public class BookingController {

     private final BookingService bookingService;

     public BookingController(BookingService bookingService) { this.bookingService = bookingService; }

     @PostMapping
     public ResponseEntity<BookingResponse> createBooking(@Valid @RequestBody CreateBookingRequest req) {
          BookingResponse resp = bookingService.createBooking(req);
          return ResponseEntity.status(201).body(resp);
     }

     @PreAuthorize("hasRole('ROLE_ADMIN') or @securityService.isBookingOwner(#id)")
     @PutMapping("/{id}/confirm")
     public ResponseEntity<BookingResponse> confirmBooking(@PathVariable("id") Long id) {
          BookingResponse resp = bookingService.confirmBooking(id);
          return ResponseEntity.ok(resp);
     }

     @PreAuthorize("hasRole('ROLE_ADMIN') or @securityService.isBookingOwner(#id)")
     @PutMapping("/{id}/cancel")
     public ResponseEntity<BookingResponse> cancelBooking(@PathVariable("id") Long id,
                                                          @RequestParam(value = "reason", required = false) String reason) {
          BookingResponse resp = bookingService.cancelBooking(id, reason);
          return ResponseEntity.ok(resp);
     }
}
