package com.example.carrental.repository;

import com.example.carrental.model.CarImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CarImageRepository extends JpaRepository<CarImage, Long> {
     List<CarImage> findByCarIdOrderByIsPrimaryDescUploadedAtDesc(Long carId);
     Optional<CarImage> findByIdAndCarId(Long id, Long carId);
     void deleteByIdAndCarId(Long id, Long carId);
}
