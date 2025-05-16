package com.roadmitra.requests;

public class LoginRequest {
    
    private String userId;
    public String getUserId() {
        return userId;
    }
    public void setUserId(String userId) {
        this.userId = userId;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    private String password;
    public LoginRequest(String userId, String password) {
        this.userId = userId;
        this.password = password;
    }
    public LoginRequest() {
    }
    
}
