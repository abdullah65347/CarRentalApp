package com.example.carrental.service;

import com.example.carrental.model.Car;
import com.example.carrental.repository.BookingRepository;
import com.example.carrental.repository.CarRepository;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;
@Service
public class AvailabilityService {

     private final BookingRepository bookingRepository;
     private final CarRepository carRepository;

     public AvailabilityService(BookingRepository bookingRepository, CarRepository carRepository) {
          this.bookingRepository = bookingRepository;
          this.carRepository = carRepository;
     }

     public boolean isCarAvailable(String carId,
                                   OffsetDateTime start,
                                   OffsetDateTime end) {

          List<String> activeStatuses = List.of("PENDING", "CONFIRMED");

          boolean overlap = bookingRepository.existsOverlappingBooking(
                  carId, start, end, activeStatuses
          );

          return !overlap;
     }

     public List<String> getAvailableCarIds(OffsetDateTime start, OffsetDateTime end) {

          List<Car> allCars = carRepository.findAll();

          return allCars.stream()
                  .filter(car -> isCarAvailable(car.getId(), start, end))
                  .map(Car::getId)
                  .toList();
     }
}
