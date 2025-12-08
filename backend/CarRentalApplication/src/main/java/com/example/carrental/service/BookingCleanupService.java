package com.example.carrental.service;

import com.example.carrental.model.Booking;
import com.example.carrental.repository.BookingRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;

/**
 * Periodically cancels stale PENDING bookings older than configured TTL.
 * This prevents 'PENDING' reservations from blocking availability forever.
 */
@Service
public class BookingCleanupService {

     private static final Logger log = LoggerFactory.getLogger(BookingCleanupService.class);

     private final BookingRepository bookingRepository;

     /**
      * TTL in minutes after which a PENDING booking is considered stale and will be cancelled.
      */
     private final long pendingTtlMinutes;

     public BookingCleanupService(BookingRepository bookingRepository,
                                  @Value("${app.booking.pending-ttl-minutes:30}") long pendingTtlMinutes) {
          this.bookingRepository = bookingRepository;
          this.pendingTtlMinutes = pendingTtlMinutes;
     }

     /**
      * Runs every X milliseconds (configured via property or default). Picks stale PENDING bookings
      * and cancels them with a standard reason.
      *
      * Default: runs every 10 minutes (600000 ms). Configure via app.booking.cleanup-interval-ms
      */
     @Scheduled(fixedDelayString = "${app.booking.cleanup-interval-ms:600000}")
     @Transactional
     public void cancelStalePendingBookings() {
          OffsetDateTime cutoff = OffsetDateTime.now().minusMinutes(pendingTtlMinutes);
          List<Booking> stale = bookingRepository.findByStatusAndCreatedAtBefore("PENDING", cutoff);
          if (stale.isEmpty()) {
               log.debug("BookingCleanup: no stale PENDING bookings found (cutoff: {})", cutoff);
               return;
          }

          log.info("BookingCleanup: found {} stale PENDING bookings older than {} minutes — cancelling", stale.size(), pendingTtlMinutes);
          for (Booking b : stale) {
               try {
                    b.setStatus("CANCELLED");
                    b.setCancellationReason("Auto-cancelled due to unpaid/stale PENDING booking");
                    bookingRepository.save(b);
                    log.info("BookingCleanup: cancelled booking id={} carId={} userId={}", b.getId(), b.getCar() != null ? b.getCar().getId() : null, b.getUser() != null ? b.getUser().getId() : null);
               } catch (Exception e) {
                    log.error("BookingCleanup: failed to cancel booking id={}: {}", b.getId(), e.getMessage(), e);
               }
          }
     }
}
