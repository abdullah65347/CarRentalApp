package com.example.carrental.repository;

import com.example.carrental.model.CarImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CarImageRepository extends JpaRepository<CarImage, Long> {
     List<CarImage> findByCarIdOrderByIsPrimaryDescUploadedAtDesc(String carId);
     Optional<CarImage> findByIdAndCarId(Long id, String carId);
     void deleteByIdAndCarId(Long id, String carId);
}
