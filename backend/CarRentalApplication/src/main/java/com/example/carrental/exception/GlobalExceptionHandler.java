package com.example.carrental.exception;

import com.example.carrental.dto.ApiError;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ControllerAdvice;
import java.util.List;

@ControllerAdvice
public class GlobalExceptionHandler {

     @ExceptionHandler(ResourceNotFoundException.class)
     public ResponseEntity<ApiError> handleNotFound(
             ResourceNotFoundException ex,
             HttpServletRequest req) {

          ApiError err = new ApiError(
                  HttpStatus.NOT_FOUND.value(),
                  "Not Found",
                  ex.getMessage(),
                  req.getRequestURI()
          );
          return ResponseEntity.status(HttpStatus.NOT_FOUND).body(err);
     }

     @ExceptionHandler(BadRequestException.class)
     public ResponseEntity<ApiError> handleBadRequest(
             BadRequestException ex,
             HttpServletRequest req) {

          ApiError err = new ApiError(
                  HttpStatus.BAD_REQUEST.value(),
                  "Bad Request",
                  ex.getMessage(),
                  req.getRequestURI()
          );
          return ResponseEntity.badRequest().body(err);
     }

     @ExceptionHandler(BookingConflictException.class)
     public ResponseEntity<ApiError> handleConflict(
             BookingConflictException ex,
             HttpServletRequest req) {

          ApiError err = new ApiError(
                  HttpStatus.CONFLICT.value(),
                  "Conflict",
                  ex.getMessage(),
                  req.getRequestURI()
          );
          return ResponseEntity.status(HttpStatus.CONFLICT).body(err);
     }

     @ExceptionHandler(MethodArgumentNotValidException.class)
     public ResponseEntity<ApiError> handleValidation(
             MethodArgumentNotValidException ex,
             HttpServletRequest req) {

          List<String> errors = ex.getBindingResult()
                  .getFieldErrors()
                  .stream()
                  .map(FieldError::getDefaultMessage)
                  .toList();

          ApiError err = new ApiError(
                  HttpStatus.BAD_REQUEST.value(),
                  "Validation Failed",
                  "Invalid request data",
                  req.getRequestURI()
          );
          err.setValidationErrors(errors);

          return ResponseEntity.badRequest().body(err);
     }

     @ExceptionHandler(Exception.class)
     public ResponseEntity<ApiError> handleGeneric(
             Exception ex,
             HttpServletRequest req) {

          ApiError err = new ApiError(
                  HttpStatus.INTERNAL_SERVER_ERROR.value(),
                  "Internal Server Error",
                  "Something went wrong. Please try again later.",
                  req.getRequestURI()
          );

          return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(err);
     }
}
