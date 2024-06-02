package vodzinskiy.backend.services;

import jakarta.servlet.http.HttpSession;
import vodzinskiy.backend.dto.UserRequest;
import vodzinskiy.backend.dto.UserResponse;
import vodzinskiy.backend.models.User;

import java.util.UUID;

public interface UserService {
    UserResponse createUser(UserRequest request);
    UserResponse editUser(UUID id, UserRequest request);
    User getUser(UUID id);
    User getUserByEmail(String email);
    UUID getIdFromSession(HttpSession session);
    void deleteUser(UUID id);
}
