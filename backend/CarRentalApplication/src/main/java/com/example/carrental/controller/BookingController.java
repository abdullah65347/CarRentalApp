package com.example.carrental.controller;

import com.example.carrental.dto.BookingResponse;
import com.example.carrental.dto.CreateBookingRequest;
import com.example.carrental.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

     /* Add bookings (ADMIN & USER only) */
     @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER')")
     @PostMapping
     public ResponseEntity<BookingResponse> createBooking(@Valid @RequestBody CreateBookingRequest req) {
          BookingResponse resp = bookingService.createBooking(req);
          return ResponseEntity.status(201).body(resp);
     }

     /* Get all bookings (ADMIN & OWNER only)   */
     @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_OWNER')")
     @PutMapping("/{id}/confirm")
     public ResponseEntity<BookingResponse> confirmBooking(@PathVariable("id") String id) {
          BookingResponse resp = bookingService.confirmBooking(id);
          return ResponseEntity.ok(resp);
     }

     /* Cancel bookings (ADMIN & OWNER & USER)   */
     @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_OWNER') or hasRole('ROLE_USER')")
     @PutMapping("/{id}/cancel")
     public ResponseEntity<BookingResponse> cancelBooking(@PathVariable("id") String id,
                                                          @RequestParam(value = "reason", required = true) String reason) {
          BookingResponse resp = bookingService.cancelBooking(id, reason);
          return ResponseEntity.ok(resp);
     }

     /* Get all user bookings (user only) */
     @PreAuthorize("hasRole('ROLE_USER')")
     @GetMapping("/my")
     public ResponseEntity<List<BookingResponse>> getMyBookings() {
          return ResponseEntity.ok(bookingService.getMyBookings());
     }

     /* Get bookings for OWNER's cars */
     @PreAuthorize("hasRole('ROLE_OWNER')")
     @GetMapping("/owner")
     public ResponseEntity<List<BookingResponse>> getOwnerBookings() {
          return ResponseEntity.ok(bookingService.getOwnerBookings());
     }

     /* Get all bookings (ADMIN only) */
     @GetMapping
     @PreAuthorize("hasRole('ROLE_ADMIN')")
     public ResponseEntity<List<BookingResponse>> getAllBookings() {
          return ResponseEntity.ok(bookingService.getAllBookings());
     }

}
