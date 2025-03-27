package com.uni.mstheme.Proxy;


import com.uni.mstheme.DTO.StudentDTO;
import org.springframework.cloud.loadbalancer.annotation.LoadBalancerClient;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "ms-administration")
@LoadBalancerClient(name = "ms-administration")
public interface AdminProxy {
    @GetMapping("/api/admin/students/{id}")
    StudentDTO getStudent(@PathVariable Long id);
}
