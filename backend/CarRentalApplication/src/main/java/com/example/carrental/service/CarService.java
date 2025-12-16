package com.example.carrental.service;

import com.example.carrental.dto.CarResponse;
import com.example.carrental.dto.CreateCarRequest;
import com.example.carrental.exception.ResourceNotFoundException;
import com.example.carrental.model.Car;
import com.example.carrental.model.Location;
import com.example.carrental.model.User;
import com.example.carrental.repository.CarRepository;
import com.example.carrental.repository.LocationRepository;
import com.example.carrental.repository.UserRepository;
import com.example.carrental.util.UniqueIdGenerator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.*;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CarService {

     private final UniqueIdGenerator idGenerator;
     private final CarRepository carRepository;
     private final LocationRepository locationRepository;
     private final UserRepository userRepository;
     private final SecurityService securityService;
     private final EntityManager em;

     public CarService(CarRepository carRepository,
                       LocationRepository locationRepository,
                       UserRepository userRepository,
                       EntityManager em,
                       UniqueIdGenerator idGenerator,
                       SecurityService securityService) {
          this.carRepository = carRepository;
          this.locationRepository = locationRepository;
          this.userRepository = userRepository;
          this.em = em;
          this.idGenerator = idGenerator;
          this.securityService = securityService;
     }

     private String generateUniqueCarId() {
          while (true) {
               String id = idGenerator.generate("CAR");
               if (!carRepository.existsById(id)) {
                    return id;
               }
          }
     }

     @Transactional
     public CarResponse createCar(CreateCarRequest req) {
          Car car = new Car();

          if (req.getOwnerId() != null) {
               User owner = userRepository.findById(req.getOwnerId())
                       .orElseThrow(() -> new ResourceNotFoundException("Owner not found"));
               car.setOwner(owner);
          }

          car.setId(generateUniqueCarId());
          car.setMake(req.getMake());
          car.setModel(req.getModel());
          car.setYear(req.getYear());
          car.setPlateNumber(req.getPlateNumber());
          car.setSeats(req.getSeats());
          car.setCarType(req.getCarType());
          car.setTransmission(req.getTransmission());
          car.setFuelType(req.getFuelType());
          car.setPricePerDay(req.getPricePerDay());
          car.setDescription(req.getDescription());
          car.setStatus(req.getStatus() != null ? req.getStatus() : "ACTIVE");

          Location loc = locationRepository.findById(req.getLocationId())
                  .orElseThrow(() -> new ResourceNotFoundException("Location not found"));
          car.setLocation(loc);

          Car saved = carRepository.save(car);
          return mapToResponse(saved);
     }

     // get cars by current owner (pagination removed)
     public List<CarResponse> getCarsByCurrentOwner() {
          Long ownerId = securityService.currentUserId();
          List<Car> cars = carRepository.findByOwnerId(ownerId);
          return cars.stream().map(this::mapToResponse).collect(Collectors.toList());
     }

     @Transactional
     public CarResponse updateCar(String id, CreateCarRequest req) {
          Car car = carRepository.findById(id)
                  .orElseThrow(() -> new ResourceNotFoundException("Car not found"));

          if (req.getOwnerId() != null) {
               User owner = userRepository.findById(req.getOwnerId())
                       .orElseThrow(() -> new ResourceNotFoundException("Owner not found"));
               car.setOwner(owner);
          }

          car.setMake(req.getMake());
          car.setModel(req.getModel());
          car.setYear(req.getYear());
          car.setPlateNumber(req.getPlateNumber());
          car.setSeats(req.getSeats());
          car.setCarType(req.getCarType());
          car.setTransmission(req.getTransmission());
          car.setFuelType(req.getFuelType());
          car.setPricePerDay(req.getPricePerDay());
          car.setDescription(req.getDescription());
          car.setStatus(req.getStatus() != null ? req.getStatus() : car.getStatus());

          Location loc = locationRepository.findById(req.getLocationId())
                  .orElseThrow(() -> new ResourceNotFoundException("Location not found"));
          car.setLocation(loc);

          Car saved = carRepository.save(car);
          return mapToResponse(saved);
     }

     public CarResponse getCar(String id) {
          Car car = carRepository.findById(id)
                  .orElseThrow(() -> new ResourceNotFoundException("Car not found"));
          return mapToResponse(car);
     }

     /**
      * List cars with filters (pagination removed)
      */
     public List<CarResponse> listCars(String city, Double minPrice, Double maxPrice,
                                       Integer seats, String carType) {

          CriteriaBuilder cb = em.getCriteriaBuilder();
          CriteriaQuery<Car> cq = cb.createQuery(Car.class);
          Root<Car> car = cq.from(Car.class);
          List<Predicate> predicates = new ArrayList<>();

          if (city != null && !city.isBlank()) {
               Join<Car, Location> locJoin = car.join("location", JoinType.INNER);
               predicates.add(cb.equal(cb.lower(locJoin.get("city")), city.toLowerCase()));
          }
          if (minPrice != null) {
               predicates.add(cb.ge(car.get("pricePerDay"), minPrice));
          }
          if (maxPrice != null) {
               predicates.add(cb.le(car.get("pricePerDay"), maxPrice));
          }
          if (seats != null) {
               predicates.add(cb.equal(car.get("seats"), seats));
          }
          if (carType != null && !carType.isBlank()) {
               predicates.add(cb.equal(cb.lower(car.get("carType")), carType.toLowerCase()));
          }

          predicates.add(cb.equal(car.get("status"), "ACTIVE"));
          cq.where(predicates.toArray(new Predicate[0]));
          cq.orderBy(cb.desc(car.get("id")));

          TypedQuery<Car> query = em.createQuery(cq);
          List<Car> resultList = query.getResultList();

          return resultList.stream()
                  .map(this::mapToResponse)
                  .collect(Collectors.toList());
     }

     private CarResponse mapToResponse(Car c) {
          CarResponse r = new CarResponse();
          r.setId(c.getId());
          r.setOwnerId(c.getOwner() != null ? c.getOwner().getId() : null);
          r.setMake(c.getMake());
          r.setModel(c.getModel());
          r.setYear(c.getYear());
          r.setPlateNumber(c.getPlateNumber());
          r.setSeats(c.getSeats());
          r.setCarType(c.getCarType());
          r.setTransmission(c.getTransmission());
          r.setFuelType(c.getFuelType());
          r.setPricePerDay(c.getPricePerDay());
          r.setDescription(c.getDescription());
          r.setLocationId(c.getLocation() != null ? c.getLocation().getId() : null);
          r.setStatus(c.getStatus());
          return r;
     }
}
