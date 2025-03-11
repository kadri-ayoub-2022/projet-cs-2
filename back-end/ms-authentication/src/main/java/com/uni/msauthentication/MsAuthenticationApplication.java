package com.uni.msauthentication;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class MsAuthenticationApplication {

    public static void main(String[] args) {
        SpringApplication.run(MsAuthenticationApplication.class, args);
    }

}
