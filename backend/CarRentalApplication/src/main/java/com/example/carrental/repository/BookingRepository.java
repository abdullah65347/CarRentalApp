package com.example.carrental.repository;

import com.example.carrental.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.OffsetDateTime;

public interface BookingRepository extends JpaRepository<Booking, Long> {

     @Query("SELECT COUNT(b) > 0 FROM Booking b WHERE b.car.id = :carId AND b.status IN :activeStatuses " +
             "AND NOT (b.endDatetime <= :start OR b.startDatetime >= :end)")
     boolean existsOverlappingBooking(@Param("carId") Long carId,
                                      @Param("start") OffsetDateTime start,
                                      @Param("end") OffsetDateTime end,
                                      @Param("activeStatuses") java.util.List<String> activeStatuses);
}