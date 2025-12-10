package com.example.carrental.service;

import com.example.carrental.model.Car;
import com.example.carrental.model.CarImage;
import com.example.carrental.repository.CarImageRepository;
import com.example.carrental.repository.CarRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class CarImageService {

     private final CarImageRepository carImageRepository;
     private final CarRepository carRepository;
     private final FileStorageService fileStorageService;

     public CarImageService(CarImageRepository carImageRepository,
                            CarRepository carRepository,
                            FileStorageService fileStorageService) {
          this.carImageRepository = carImageRepository;
          this.carRepository = carRepository;
          this.fileStorageService = fileStorageService;
     }

     @Transactional
     public CarImage upload(String carId, MultipartFile file) throws IOException {
          Car car = carRepository.findById(carId)
                  .orElseThrow(() -> new IllegalArgumentException("Car not found"));

          // Basic content-type validation (allow images)
          String ct = file.getContentType();
          if (ct == null || (!ct.startsWith("image/"))) {
               throw new IllegalArgumentException("Only image uploads are allowed");
          }

          String url = fileStorageService.storeFile(file, carId);

          CarImage img = new CarImage();
          img.setCar(car);
          img.setUrl(url);
          // If there are no images yet, mark this as primary
          List<CarImage> existing = carImageRepository.findByCarIdOrderByIsPrimaryDescUploadedAtDesc(carId);
          if (existing.isEmpty()) img.setIsPrimary(true);
          img = carImageRepository.save(img);
          return img;
     }

     @Transactional(readOnly = true)
     public List<CarImage> listImages(String carId) {
          return carImageRepository.findByCarIdOrderByIsPrimaryDescUploadedAtDesc(carId);
     }

     @Transactional
     public void setPrimary(String carId, Long imageId) {
          CarImage target = carImageRepository.findByIdAndCarId(imageId, carId)
                  .orElseThrow(() -> new IllegalArgumentException("Image not found for this car"));

          // unset previous primary
          List<CarImage> imgs = carImageRepository.findByCarIdOrderByIsPrimaryDescUploadedAtDesc(carId);
          for (CarImage i : imgs) {
               if (i.getIsPrimary() != null && i.getIsPrimary() && !i.getId().equals(imageId)) {
                    i.setIsPrimary(false);
                    carImageRepository.save(i);
               }
          }
          target.setIsPrimary(true);
          carImageRepository.save(target);
     }

     @Transactional
     public void delete(String carId, Long imageId) {
          CarImage img = carImageRepository.findByIdAndCarId(imageId, carId)
                  .orElseThrow(() -> new IllegalArgumentException("Image not found for this car"));

          // delete file if stored locally
          fileStorageService.deleteFileByUrl(img.getUrl());
          carImageRepository.deleteById(imageId);

          // If deleted image was primary, set another as primary (if exists)
          if (Boolean.TRUE.equals(img.getIsPrimary())) {
               List<CarImage> rest = carImageRepository.findByCarIdOrderByIsPrimaryDescUploadedAtDesc(carId);
               if (!rest.isEmpty()) {
                    CarImage first = rest.get(0);
                    first.setIsPrimary(true);
                    carImageRepository.save(first);
               }
          }
     }
}
