package org.example.msevaluationmonitoringproject.Proxy;

import org.example.msevaluationmonitoringproject.DTO.ProjectThemeDTO;
import org.springframework.cloud.loadbalancer.annotation.LoadBalancerClient;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.List;

@FeignClient(name = "ms-theme")
@LoadBalancerClient(name = "ms-theme")
public interface TaskClient {
    @GetMapping("/api/project-themes/my-themes")
    ResponseEntity<?> getProjectThemesByTeacherId(@RequestHeader("Authorization") String token);
}
