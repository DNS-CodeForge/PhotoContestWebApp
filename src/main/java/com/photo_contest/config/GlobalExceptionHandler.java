package com.photo_contest.config;

import com.photo_contest.exeptions.AuthorizationException;
import com.photo_contest.exeptions.ContestPhaseViolationException;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;

@ControllerAdvice
public class GlobalExceptionHandler {

    public static final String UNEXPECTED_ERROR = "An unexpected error occurred.";


    @ExceptionHandler(EntityExistsException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    @ResponseBody
    public ResponseEntity<LinkedHashMap<String, Object>> handleEntityExistsException(EntityExistsException ex) {
        return createErrorResponse(HttpStatus.CONFLICT, ex.getMessage());
    }


    @ExceptionHandler(EntityNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ResponseBody
    public ResponseEntity<LinkedHashMap<String, Object>> handleEntityNotFoundException(EntityNotFoundException ex) {
        return createErrorResponse(HttpStatus.NOT_FOUND, ex.getMessage());
    }


    @ExceptionHandler(AuthorizationException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    @ResponseBody
    public ResponseEntity<LinkedHashMap<String, Object>> handleAuthorizationException(AuthorizationException ex) {
        return createErrorResponse(HttpStatus.FORBIDDEN, ex.getMessage());
    }


    @ExceptionHandler(ContestPhaseViolationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    public ResponseEntity<LinkedHashMap<String, Object>> handleContestPhaseViolationException(ContestPhaseViolationException ex) {
        return createErrorResponse(HttpStatus.BAD_REQUEST, ex.getMessage());
    }


    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ResponseBody
    public ResponseEntity<LinkedHashMap<String, Object>> handleGenericException(Exception ex) {
        return createErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, UNEXPECTED_ERROR);
    }


    private ResponseEntity<LinkedHashMap<String, Object>> createErrorResponse(HttpStatus status, String message) {
        LinkedHashMap<String, Object> errorResponse = new LinkedHashMap<>();
        errorResponse.put("status", status.value());
        errorResponse.put("error", status.getReasonPhrase());
        errorResponse.put("message", message);
        errorResponse.put("timestamp", LocalDateTime.now());

        return ResponseEntity.status(status).body(errorResponse);
    }
}
