package com.example.carrental.repository;

import com.example.carrental.model.Car;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CarRepository extends JpaRepository<Car, String> {

     /**
      * Acquire a pessimistic write lock on the car row to prevent concurrent bookings.
      */
     @Lock(LockModeType.PESSIMISTIC_WRITE)
     @Query("SELECT c FROM Car c WHERE c.id = :id")
     Optional<Car> findByIdForUpdate(@Param("id") String id);

     // removed Pageable, return full list
     List<Car> findByOwnerId(Long ownerId);
}
