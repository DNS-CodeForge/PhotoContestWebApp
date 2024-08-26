package com.photo_contest.utils;

import java.security.KeyPair;
import java.security.KeyPairGenerator;

public class KeyGeneratorUtility {


    public static KeyPair createRsaKeyPair() {

        try {

            KeyPair keyPair;

            try {
                KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");
                keyPairGenerator.initialize(2048);
                keyPair = keyPairGenerator.generateKeyPair();
            } catch (Exception e) {
                throw new IllegalStateException();
            }

             return keyPair;

        } catch (Exception e) {
            throw new IllegalStateException("Error creating hardcoded RSA key pair", e);
        }
    }
}
