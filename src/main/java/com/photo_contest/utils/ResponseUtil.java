package com.photo_contest.utils;

import com.photo_contest.models.Contest;
import org.springframework.data.domain.Page;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.LinkedHashMap;

public class ResponseUtil {
    public static <T> CustomResponse buildPaginatedContestResponse(Page<Contest> pageData, UriComponentsBuilder uriBuilder) {
        CustomResponse response = new CustomResponse();
        response.setStatus("success");
        response.setMessage("Contests fetched successfully");


        LinkedHashMap<String, Object> paginationData = new LinkedHashMap<>();
        paginationData.put("currentPage", pageData.getNumber());
        paginationData.put("pageSize", pageData.getSize());
        paginationData.put("totalPages", pageData.getTotalPages());
        paginationData.put("totalItems", pageData.getTotalElements());


        if (pageData.hasNext()) {
            paginationData.put("nextPageUrl", uriBuilder.replaceQueryParam("page", pageData.getNumber() + 1).toUriString());
        } else {
            paginationData.put("nextPageUrl", null);
        }


        if (pageData.hasPrevious()) {
            paginationData.put("previousPageUrl", uriBuilder.replaceQueryParam("page", pageData.getNumber() - 1).toUriString());
        } else {
            paginationData.put("previousPageUrl", null);
        }
        response.getData().put("pagination", paginationData);


        response.getData().put("contests", pageData.getContent());

        return response;
    }
}
