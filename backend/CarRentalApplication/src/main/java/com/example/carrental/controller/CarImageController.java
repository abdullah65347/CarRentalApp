package com.example.carrental.controller;

import com.example.carrental.model.CarImage;
import com.example.carrental.service.CarImageService;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/cars/{carId}/images")
public class CarImageController {

     private final CarImageService carImageService;

     public CarImageController(CarImageService carImageService) {
          this.carImageService = carImageService;
     }
     @PreAuthorize("hasRole('ROLE_ADMIN') or @securityService.isCarOwner(#carId)")
     @PostMapping
     public ResponseEntity<CarImage> uploadImage(@PathVariable("carId") Long carId,
                                                 @RequestParam("file") @NotNull MultipartFile file) throws IOException {
          CarImage saved = carImageService.upload(carId, file);
          return ResponseEntity.status(201).body(saved);
     }

     @GetMapping
     public ResponseEntity<List<CarImage>> listImages(@PathVariable("carId") Long carId) {
          List<CarImage> imgs = carImageService.listImages(carId);
          return ResponseEntity.ok(imgs);
     }

     @PreAuthorize("hasRole('ROLE_ADMIN') or @securityService.isCarOwner(#carId)")
     @PutMapping("/{imageId}/primary")
     public ResponseEntity<Void> setPrimary(@PathVariable("carId") Long carId,
                                            @PathVariable("imageId") Long imageId) {
          carImageService.setPrimary(carId, imageId);
          return ResponseEntity.ok().build();
     }

     @PreAuthorize("hasRole('ROLE_ADMIN') or @securityService.isCarOwner(#carId)")
     @DeleteMapping("/{imageId}")
     public ResponseEntity<Void> deleteImage(@PathVariable("carId") Long carId,
                                             @PathVariable("imageId") Long imageId) {
          carImageService.delete(carId, imageId);
          return ResponseEntity.noContent().build();
     }
}
