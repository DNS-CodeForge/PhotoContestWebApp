package com.photo_contest.services;


import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.photo_contest.services.contracts.CloudinaryImageService;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Collections;
import java.util.Map;

@Service
public class CloudinaryImageServiceImpl implements CloudinaryImageService {
    private static final String URL_KEY = "url";

    private final Cloudinary cloudinary;

    public CloudinaryImageServiceImpl(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    @Override
    public String uploadImage(MultipartFile multipartFile) throws IOException {

        Path tempFile = Files.createTempFile("temp-file-", multipartFile.getOriginalFilename());

        try {

            multipartFile.transferTo(tempFile.toFile());
            Map result = cloudinary.uploader().upload(tempFile.toFile(), Collections.emptyMap());

            return result.get(URL_KEY).toString();

        } finally {

            Files.deleteIfExists(tempFile);
        }
    }

    @Override
    public String uploadImageFromUrl(String imageUrl) throws IOException {
        Map result = cloudinary.uploader().upload(imageUrl, ObjectUtils.asMap("resource_type", "image"));
        return result.get(URL_KEY).toString();
    }
}
