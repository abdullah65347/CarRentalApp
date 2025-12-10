package com.example.carrental.model;

import com.example.carrental.util.IdGeneratorProvider;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "locations")
@Getter
@Setter
public class Location {
     @Id
     @Column(name = "id", nullable = false, unique = true)
     private String id;

     private String name;
     private String address;
     private String city;
     private String state;
     private String country;
     private Double lat;
     private Double lng;

     @PrePersist
     public void ensureId() {
          if (this.id == null || this.id.isBlank()) {
               this.id = IdGeneratorProvider.getGenerator().generate("LOC");
          }
     }
}
