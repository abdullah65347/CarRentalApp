package com.example.carrental.repository;

import com.example.carrental.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.OffsetDateTime;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

     @Query("SELECT COUNT(b) > 0 FROM Booking b WHERE b.car.id = :carId AND b.status IN :activeStatuses " +
             "AND NOT (b.endDatetime <= :start OR b.startDatetime >= :end)")
     boolean existsOverlappingBooking(@Param("carId") Long carId,
                                      @Param("start") OffsetDateTime start,
                                      @Param("end") OffsetDateTime end,
                                      @Param("activeStatuses") java.util.List<String> activeStatuses);

     boolean existsByUserIdAndCarIdAndStatus(Long userId, Long carId, String status);

     // find pending bookings older than cutoff (used by cleanup)
     List<Booking> findByStatusAndCreatedAtBefore(String status, OffsetDateTime cutoff);

     // optional: list bookings for a user with paging
     List<Booking> findByUserIdOrderByStartDatetimeDesc(Long userId, Pageable pageable);
}