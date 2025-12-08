package com.example.carrental.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "locations")
@Getter
@Setter
public class Location {
     @Id
     @GeneratedValue(strategy = GenerationType.IDENTITY)
     private Long id;

     private String name;
     private String address;
     private String city;
     private String state;
     private String country;
     private Double lat;
     private Double lng;
}
