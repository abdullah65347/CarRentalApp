package com.example.carrental.service;

import com.example.carrental.dto.BookingResponse;
import com.example.carrental.dto.CarSummaryDto;
import com.example.carrental.dto.CreateBookingRequest;
import com.example.carrental.dto.UserSummaryDto;
import com.example.carrental.exception.BadRequestException;
import com.example.carrental.exception.BookingConflictException;
import com.example.carrental.exception.ForbiddenException;
import com.example.carrental.exception.ResourceNotFoundException;
import com.example.carrental.model.Booking;
import com.example.carrental.model.Car;
import com.example.carrental.model.Location;
import com.example.carrental.model.User;
import com.example.carrental.repository.BookingRepository;
import com.example.carrental.repository.CarRepository;
import com.example.carrental.repository.LocationRepository;
import com.example.carrental.repository.UserRepository;
import com.example.carrental.util.UniqueIdGenerator;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.OffsetDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

     private final UniqueIdGenerator idGenerator;
     private final BookingRepository bookingRepository;
     private final CarRepository carRepository;
     private final UserRepository userRepository;
     private final LocationRepository locationRepository;
     private final SecurityService securityService;

     public BookingService(BookingRepository bookingRepository, CarRepository carRepository,
                           UserRepository userRepository, LocationRepository locationRepository, UniqueIdGenerator idGenerator, SecurityService securityService) {
          this.bookingRepository = bookingRepository;
          this.carRepository = carRepository;
          this.userRepository = userRepository;
          this.locationRepository = locationRepository;
          this.idGenerator = idGenerator;
          this.securityService = securityService;
     }

     /* Auto booking id generation(BKNG-(XXXXXXXXXXX)   */
     private String generateUniqueBookingId() {
          while (true) {
               String id = idGenerator.generate("BKNG");
               if (!bookingRepository.existsById(id)) {
                    return id;
               }
               // Incredibly unlikely to enter retry loop
          }
     }

     /**
      * Create a booking transactionally.
      */
     @Transactional
     public BookingResponse createBooking(CreateBookingRequest req) {
          if (req.getStartDatetime() == null || req.getEndDatetime() == null) {
               throw new BadRequestException("Start and end datetime must be provided");
          }
          if (!req.getStartDatetime().isBefore(req.getEndDatetime())) {
               throw new BadRequestException("Start datetime must be before end datetime");
          }

          // Acquire lock on car row (uses CarRepository.findByIdForUpdate if available)
          Car car;
          try {
               car = carRepository.findByIdForUpdate(req.getCarId())
                       .orElseThrow(() -> new ResourceNotFoundException("Car not found with id: " + req.getCarId()));
          } catch (NoSuchMethodError | UnsupportedOperationException ex) {
               // fallback if repository doesn't support findByIdForUpdate
               car = carRepository.findById(req.getCarId())
                       .orElseThrow(() -> new ResourceNotFoundException("Car not found with id: " + req.getCarId()));
          }

          Location pickup = locationRepository.findById(req.getPickupLocationId())
                  .orElseThrow(() -> new ResourceNotFoundException("Pickup location not found"));
          Location dropoff = locationRepository.findById(req.getDropoffLocationId())
                  .orElseThrow(() -> new ResourceNotFoundException("Dropoff location not found"));

          // Check overlap while holding lock
          List<String> blockingStatuses = Arrays.asList("CONFIRMED", "PENDING");
          boolean existsOverlap = bookingRepository.existsOverlappingBooking(car.getId(), req.getStartDatetime(), req.getEndDatetime(), blockingStatuses);
          if (existsOverlap) {
               throw new BookingConflictException("Car is already booked for the selected time range");
          }

          // get current user from security context (assumes username = email)
          Authentication auth = SecurityContextHolder.getContext().getAuthentication();
          if (auth == null || !(auth.getPrincipal() instanceof UserDetails)) {
               throw new ForbiddenException("Unable to determine authenticated user");
          }
          String email = ((UserDetails) auth.getPrincipal()).getUsername();
          User user = userRepository.findByEmail(email)
                  .orElseThrow(() -> new ForbiddenException("Authenticated user not found in DB"));

          // calculate total price (simple day-based calculation)
          long hours = Duration.between(req.getStartDatetime(), req.getEndDatetime()).toHours();
          if (hours <= 0) hours = 24;
          double days = Math.ceil(hours / 24.0);
          double pricePerDay = (car.getPricePerDay() != null) ? car.getPricePerDay() : 0.0;
          double totalPrice = pricePerDay * days;

          Booking booking = new Booking();
          booking.setId(generateUniqueBookingId());
          booking.setCar(car);
          booking.setUser(user);
          booking.setPickupLocation(pickup);
          booking.setDropoffLocation(dropoff);
          booking.setStartDatetime(req.getStartDatetime());
          booking.setEndDatetime(req.getEndDatetime());
          booking.setTotalPrice(totalPrice);
          booking.setStatus("PENDING"); // initial

          Booking saved = bookingRepository.save(booking);

          return mapToResponse(saved);
     }

     /**
      * Confirm a booking (e.g., after payment). Changes status to CONFIRMED if currently PENDING and no overlap exists.
      */
     @Transactional
     public BookingResponse confirmBooking(String bookingId) {
          Booking b = bookingRepository.findById(bookingId)
                  .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + bookingId));

          if ("CONFIRMED".equalsIgnoreCase(b.getStatus())) {
               return mapToResponse(b);
          }
          if ("CANCELLED".equalsIgnoreCase(b.getStatus())) {
               throw new BadRequestException("Cannot confirm a cancelled booking");
          }

          // lock car row before confirming
          Car car;
          try {
               car = carRepository.findByIdForUpdate(b.getCar().getId())
                       .orElseThrow(() -> new ResourceNotFoundException("Car not found"));
          } catch (NoSuchMethodError | UnsupportedOperationException ex) {
               car = carRepository.findById(b.getCar().getId())
                       .orElseThrow(() -> new ResourceNotFoundException("Car not found"));
          }

          // ensure no overlapping confirmed bookings (excluding current booking)
          List<String> blockingStatuses = Arrays.asList("CONFIRMED");
          boolean overlap = bookingRepository.existsOverlappingBooking(car.getId(), b.getStartDatetime(), b.getEndDatetime(), blockingStatuses);
          if (overlap) {
               throw new BookingConflictException("Cannot confirm booking — overlapping confirmed booking exists");
          }

          b.setStatus("CONFIRMED");
          Booking saved = bookingRepository.save(b);
          return mapToResponse(saved);
     }

     // Get all user based booking's
     public List<BookingResponse> getMyBookings() {
          Long userId = securityService.currentUserId();
          if (userId == null) {
               throw new ForbiddenException("User not authenticated");
          }
          List<Booking> bookings = bookingRepository.findByUserId(userId);
          return bookings.stream()
                  .map(this::mapToResponse)
                  .collect(Collectors.toList());
     }

     // Get all owner car's booking's
     public List<BookingResponse> getOwnerBookings() {
          Long ownerId = securityService.currentUserId();
          List<Booking> bookings = bookingRepository.findByCarOwnerId(ownerId);

          return bookings.stream()
                  .map(this::mapToResponse)
                  .collect(Collectors.toList());
     }

     /* Get all bookings (ADMIN only)  */
     @Transactional(readOnly = true)
     public List<BookingResponse> getAllBookings() {
          return bookingRepository.findAll()
                  .stream()
                  .map(this::mapToResponse)
                  .toList();
     }

     /**
      * Cancel a booking.
      */
     @Transactional
     @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER') or hasRole('ROLE_OWNER')")
     public BookingResponse cancelBooking(String bookingId, String reason) {
          Booking b = bookingRepository.findById(bookingId)
                  .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + bookingId));

          if ("CANCELLED".equalsIgnoreCase(b.getStatus())) {
               return mapToResponse(b);
          }

          b.setStatus("CANCELLED");
          b.setCancellationReason(reason);
          Booking saved = bookingRepository.save(b);
          return mapToResponse(saved);
     }

     private BookingResponse mapToResponse(Booking booking) {

          BookingResponse resp = new BookingResponse();
          resp.setId(booking.getId());
          resp.setStartDatetime(booking.getStartDatetime());
          resp.setEndDatetime(booking.getEndDatetime());
          resp.setTotalPrice(booking.getTotalPrice());
          resp.setStatus(booking.getStatus());

          boolean isAdmin = securityService.hasRole("ROLE_ADMIN");
          boolean isOwner = securityService.hasRole("ROLE_OWNER");

          // USER INFO (role-based)
          if (booking.getUser() != null && (isAdmin || isOwner)) {
               UserSummaryDto userDto = new UserSummaryDto();

               if (isAdmin) {
                    userDto.setId(booking.getUser().getId());
                    userDto.setEmail(booking.getUser().getEmail());
               }

               if (isAdmin || isOwner) {
                    userDto.setName(booking.getUser().getName());
               }

               resp.setUser(userDto);
          }

          // CAR INFO (same for OWNER & ADMIN)
          if (booking.getCar() != null) {
               CarSummaryDto carDto = new CarSummaryDto();
               carDto.setId(booking.getCar().getId());
               carDto.setMake(booking.getCar().getMake());
               carDto.setModel(booking.getCar().getModel());
               carDto.setPlateNumber(booking.getCar().getPlateNumber());
               resp.setCar(carDto);
          }

          return resp;
     }

}
