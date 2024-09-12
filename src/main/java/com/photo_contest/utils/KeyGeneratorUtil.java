package com.photo_contest.utils;

import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.security.KeyPair;

public class KeyGeneratorUtil {

//    public static KeyPair generateRsaKeyPair() {
//        return Keys.keyPairFor(SignatureAlgorithm.RS256);
//    }
///*
//    Used when no static keys are present
//    DD
// */



//    public static void generateAndSaveKeyPair() throws Exception {
//        KeyPair keyPair = Keys.keyPairFor(SignatureAlgorithm.RS256);
///*
//    Execute this to generate a static key pair and save it to a file
//    DD
// */
//
//        // Save the private key
//        try (FileOutputStream fos = new FileOutputStream("privateKey.pem")) {
//            fos.write(keyPair.getPrivate().getEncoded());
//        }
//
//        // Save the public key
//        try (FileOutputStream fos = new FileOutputStream("publicKey.pem")) {
//            fos.write(keyPair.getPublic().getEncoded());
//        }
//    }
//
//    public static void main(String[] args) throws Exception {
//        generateAndSaveKeyPair();
//    }
}
