package com.photo_contest.services.contracts;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface CloudinaryImageService {
    String uploadImage(MultipartFile multipartFile) throws IOException;
    String uploadImageFromUrl(String imageUrl) throws IOException;

}