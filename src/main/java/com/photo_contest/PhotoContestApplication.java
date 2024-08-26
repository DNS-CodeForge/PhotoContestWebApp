package com.photo_contest;

import jakarta.transaction.Transactional;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class PhotoContestApplication {

	public static void main(String[] args) {
		SpringApplication.run(PhotoContestApplication.class, args);
	}
	@Bean
	@Transactional
	public CommandLineRunner commandLineRunner() {
		return args -> {
			System.out.println("\033[32m" +
					"******************************************************************\n" +
					"*                                                                *\n" +
					"*           Spring has loaded Successfully and is Ready.         *\n" +
					"*                                                                *\n" +
					"******************************************************************\033[0m");

		};
	}

}

