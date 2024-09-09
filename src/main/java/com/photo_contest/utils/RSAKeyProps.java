package com.photo_contest.utils;

import lombok.Getter;
import lombok.Setter;

import org.springframework.stereotype.Component;

import java.security.KeyPair;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;

@Component
@Getter
@Setter
public class RSAKeyProps {

    private RSAPublicKey publicKey;
    private RSAPrivateKey privateKey;


    public RSAKeyProps() {
        KeyPair keyPair = KeyGeneratorUtil.generateRsaKeyPair();
        this.publicKey = (RSAPublicKey) keyPair.getPublic();
        this.privateKey = (RSAPrivateKey) keyPair.getPrivate();
    }
}
