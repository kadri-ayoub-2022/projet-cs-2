package com.uni.mstheme.Proxy;


import com.uni.mstheme.DTO.SpecialtyDTO;
import com.uni.mstheme.DTO.StudentDTO;
import com.uni.mstheme.DTO.TeacherDTO;
import org.springframework.cloud.loadbalancer.annotation.LoadBalancerClient;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "ms-administration")
@LoadBalancerClient(name = "ms-administration")
public interface AdminProxy {
    @GetMapping("/api/admin/students/{id}")
    StudentDTO getStudent(@PathVariable Long id);

    @GetMapping("/api/admin/teachers/{id}")
    TeacherDTO getTeacher(@PathVariable Long id);

    @GetMapping("/api/admin/specialty/{id}")
    SpecialtyDTO getSpecialty(@PathVariable Long id);
}
