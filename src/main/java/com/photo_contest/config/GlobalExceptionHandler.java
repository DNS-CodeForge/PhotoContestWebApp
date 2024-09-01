package com.photo_contest.config;

import jakarta.persistence.EntityExistsException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.LinkedHashMap;

@ControllerAdvice
public class GlobalExceptionHandler {
    private AuthContextManager authContextManager;
    @Autowired
    void setAuthContextManager(AuthContextManager authContextManager) {
        this.authContextManager = authContextManager;
    }


    @ExceptionHandler(EntityExistsException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    @ResponseBody
    public ResponseEntity<LinkedHashMap<String, Object>> handleEntityExistsException(EntityExistsException ex) {
        LinkedHashMap<String, Object> errorResponse = new LinkedHashMap<>();
        errorResponse.put("status", HttpStatus.CONFLICT.value());
        errorResponse.put("error", HttpStatus.CONFLICT.getReasonPhrase());
        errorResponse.put("message", ex.getMessage());
        errorResponse.put("timestamp", LocalDateTime.now());
//        errorResponse.put("path", "");

        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
    }
}
