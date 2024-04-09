package vodzinskiy.backend.service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import vodzinskiy.backend.dto.LoginRequest;

public interface AuthenticationService {
    void signin(LoginRequest loginRequest, HttpServletRequest request, HttpServletResponse response);
}
