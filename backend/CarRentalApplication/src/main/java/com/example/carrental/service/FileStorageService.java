package com.example.carrental.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.*;
import java.time.Instant;
import java.util.UUID;

@Service
public class FileStorageService {

     @Value("${app.file.upload-dir:uploads}")
     private String uploadDir;

     @Value("${app.file.base-url:/uploads}")
     private String baseUrl;

     private Path uploadPath;

     @PostConstruct
     public void init() throws IOException {
          uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
          Files.createDirectories(uploadPath);
     }

     /**
      * Store file and return the public URL path (relative). Does basic validation of filename.
      */
     public String storeFile(MultipartFile file, Long carId) throws IOException {
          String original = StringUtils.cleanPath(file.getOriginalFilename());
          String ext = "";
          int idx = original.lastIndexOf('.');
          if (idx > 0) ext = original.substring(idx);
          String filename = "car-" + carId + "-" + Instant.now().toEpochMilli() + "-" + UUID.randomUUID() + ext;
          Path target = uploadPath.resolve(filename);
          // Basic checks
          if (original.contains("..")) {
               throw new IOException("Invalid file name");
          }
          // Save file
          Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
          // Return a URL path the frontend can use (you may want to serve static files from /uploads)
          return baseUrl + "/" + filename;
     }

     public boolean deleteFileByUrl(String url) {
          if (url == null) return false;
          // assume url like /uploads/filename or full URL; extract filename
          String filename = Paths.get(url).getFileName().toString();
          Path target = uploadPath.resolve(filename);
          try {
               return Files.deleteIfExists(target);
          } catch (IOException e) {
               return false;
          }
     }
}
