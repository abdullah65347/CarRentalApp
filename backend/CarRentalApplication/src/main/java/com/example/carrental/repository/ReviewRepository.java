package com.example.carrental.repository;

import com.example.carrental.model.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, String> {
     Page<Review> findByCarIdOrderByCreatedAtDesc(String carId, Pageable pageable);
}
