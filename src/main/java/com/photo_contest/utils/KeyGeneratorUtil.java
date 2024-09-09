package com.photo_contest.utils;

import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.security.KeyPair;

public class KeyGeneratorUtil {


    public static KeyPair generateRsaKeyPair() {
        return Keys.keyPairFor(SignatureAlgorithm.RS256);
    }
}
