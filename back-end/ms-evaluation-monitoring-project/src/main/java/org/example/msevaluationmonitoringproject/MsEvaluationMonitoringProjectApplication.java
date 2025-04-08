package org.example.msevaluationmonitoringproject;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@RequiredArgsConstructor
@EnableFeignClients
public class MsEvaluationMonitoringProjectApplication {

    public static void main(String[] args) {
        SpringApplication.run(MsEvaluationMonitoringProjectApplication.class, args);
    }

}
