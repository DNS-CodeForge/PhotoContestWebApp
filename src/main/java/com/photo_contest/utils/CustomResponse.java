package com.photo_contest.utils;

import lombok.Getter;
import lombok.Setter;


import java.util.LinkedHashMap;
import java.util.Map;

@Setter
@Getter
public class CustomResponse {

    private String status;
    private String message;
    private Map<String, Object> data = new LinkedHashMap<>();

}
