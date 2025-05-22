package com.uni.mstheme.Proxy;

import com.uni.mstheme.DTO.JuryResponse;
import org.springframework.cloud.loadbalancer.annotation.LoadBalancerClient;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "ms-thesis-defense")
@LoadBalancerClient(name = "ms-thesis-defense")
public interface DefenseProxy {

    @GetMapping("/api/thesisDefense/jury/{themeId}")
    JuryResponse getJuryByThemeId(@PathVariable("themeId") Long themeId);
}

