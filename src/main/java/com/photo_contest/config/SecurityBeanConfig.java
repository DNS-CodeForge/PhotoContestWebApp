package com.photo_contest.config;

import com.photo_contest.utils.RSAKeyProps;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;


@Configuration
public class SecurityBeanConfig {

    private final RSAKeyProps keyProps;

    @Autowired
    public SecurityBeanConfig(RSAKeyProps keyProps) {
        this.keyProps = keyProps;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}
