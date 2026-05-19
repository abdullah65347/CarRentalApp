package com.example.carrental.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

/**
 * Serves local uploaded files (e.g. /uploads/**) from the configured upload directory.
 * For dev it's convenient; in production serve images from a CDN / object storage.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

     @Value("${app.file.upload-dir:uploads}")
     private String uploadDir;

     @Override
     public void addResourceHandlers(ResourceHandlerRegistry registry) {

          String path = Paths.get(uploadDir)
                  .toFile()
                  .getAbsolutePath();

          registry.addResourceHandler("/uploads/**")
                  .addResourceLocations("file:///" + path + "/");
     }
}
