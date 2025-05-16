package com.roadmitra.controller;



import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.CrossOrigin;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.web.bind.annotation.RestController;

import com.roadmitra.entity.Users;
import com.roadmitra.requests.LoginRequest;
import com.roadmitra.service.UserService;



@RestController
public class UsersController {
    
    @Autowired
    UserService userService;

    @PostMapping("/addUser")
    @CrossOrigin(origins = "http://localhost:8082")
    public Users addUser(@RequestBody Users user) {
        return userService.addUser(user);
    }
    @PostMapping("/loginUser")
    public Boolean  loginUser(@RequestBody LoginRequest loginRequest) {

        return userService.loginUser(loginRequest);
    }
   

}
