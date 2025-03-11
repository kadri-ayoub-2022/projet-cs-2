package com.uni.msauthentication.Proxies;

import com.uni.msauthentication.DTO.AdminDTO;
import com.uni.msauthentication.DTO.TeacherDTO;
import com.uni.msauthentication.DTO.StudentDTO;
import org.springframework.cloud.loadbalancer.annotation.LoadBalancerClient;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.http.ResponseEntity;

@FeignClient(name = "ms-administration")
@LoadBalancerClient(name = "ms-administration")
public interface UserProxy {

    @GetMapping("/api/users/admin")
    ResponseEntity<AdminDTO> getAdminByEmail(@RequestParam String email);

    @GetMapping("/api/users/teacher")
    ResponseEntity<TeacherDTO> getTeacherByEmail(@RequestParam String email);

    @GetMapping("/api/users/student")
    ResponseEntity<StudentDTO> getStudentByEmail(@RequestParam String email);

    @PutMapping("api/users/update-password")
    ResponseEntity<Void> updatePassword(@RequestParam String email, @RequestParam String newPassword);
}

