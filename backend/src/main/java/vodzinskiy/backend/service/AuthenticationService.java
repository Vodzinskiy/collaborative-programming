package vodzinskiy.backend.service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import vodzinskiy.backend.dto.LoginRequest;
import vodzinskiy.backend.dto.UserResponse;

public interface AuthenticationService {
    UserResponse signin(LoginRequest loginRequest, HttpServletRequest request, HttpServletResponse response);
}
