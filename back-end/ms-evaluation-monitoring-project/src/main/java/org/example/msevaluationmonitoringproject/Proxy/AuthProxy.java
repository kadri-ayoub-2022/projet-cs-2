package org.example.msevaluationmonitoringproject.Proxy;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.loadbalancer.annotation.LoadBalancerClient;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "ms-authentication")
@LoadBalancerClient(name = "ms-authentication")
public interface AuthProxy {

    @GetMapping("/auth/me")
    ResponseEntity<?> getAuthenticatedUser(@RequestHeader("Authorization") String token);
}
