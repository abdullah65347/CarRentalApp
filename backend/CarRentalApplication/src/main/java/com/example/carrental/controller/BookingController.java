package com.example.carrental.controller;

import com.example.carrental.dto.BookingResponse;
import com.example.carrental.dto.CreateBookingRequest;
import com.example.carrental.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

     private final BookingService bookingService;

     public BookingController(BookingService bookingService) {
          this.bookingService = bookingService;
     }

     @PostMapping
     public ResponseEntity<BookingResponse> createBooking(@Valid @RequestBody CreateBookingRequest req) {
          BookingResponse resp = bookingService.createBooking(req);
          return ResponseEntity.status(201).body(resp);
     }

     /**
      * Confirm a booking (e.g., called after payment webhook). Returns 200 with updated booking.
      * Access should be restricted (owner, admin, or system) — add @PreAuthorize if needed.
      */
     @PutMapping("/{id}/confirm")
     public ResponseEntity<BookingResponse> confirmBooking(@PathVariable("id") Long id) {
          BookingResponse resp = bookingService.confirmBooking(id);
          return ResponseEntity.ok(resp);
     }

     /**
      * Cancel a booking. Accepts optional reason in body.
      */
     @PutMapping("/{id}/cancel")
     public ResponseEntity<BookingResponse> cancelBooking(@PathVariable("id") Long id,
                                                          @RequestParam(value = "reason", required = false) String reason) {
          BookingResponse resp = bookingService.cancelBooking(id, reason);
          return ResponseEntity.ok(resp);
     }
}
