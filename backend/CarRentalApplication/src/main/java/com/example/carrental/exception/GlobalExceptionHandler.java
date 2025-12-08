package com.example.carrental.exception;

import com.example.carrental.dto.ApiError;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.List;
import java.util.stream.Collectors;

@ControllerAdvice
public class GlobalExceptionHandler {

     @ExceptionHandler(IllegalArgumentException.class)
     public ResponseEntity<ApiError> handleIllegalArg(IllegalArgumentException ex, HttpServletRequest req) {
          ApiError err = new ApiError(HttpStatus.BAD_REQUEST.value(), "Bad Request", ex.getMessage(), req.getRequestURI());
          return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(err);
     }

     @ExceptionHandler(Exception.class)
     public ResponseEntity<ApiError> handleAll(Exception ex, HttpServletRequest req) {
          ApiError err = new ApiError(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Internal Server Error", ex.getMessage(), req.getRequestURI());
          return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(err);
     }

     @ResponseStatus(HttpStatus.BAD_REQUEST)
     @ExceptionHandler(MethodArgumentNotValidException.class)
     public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException ex, HttpServletRequest req) {
          List<String> errors = ex.getBindingResult().getFieldErrors().stream()
                  .map(FieldError::getDefaultMessage)
                  .collect(Collectors.toList());

          ApiError err = new ApiError(HttpStatus.BAD_REQUEST.value(), "Validation Failed", "Validation error", req.getRequestURI());
          err.setValidationErrors(errors);
          return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(err);
     }

     @ExceptionHandler(BookingConflictException.class)
     public ResponseEntity<ApiError> handleBookingConflict(BookingConflictException ex, HttpServletRequest req) {
          ApiError err = new ApiError(HttpStatus.CONFLICT.value(), "Conflict", ex.getMessage(), req.getRequestURI());
          return ResponseEntity.status(HttpStatus.CONFLICT).body(err);
     }

}