package vodzinskiy.backend.service;

import vodzinskiy.backend.dto.UserRequest;
import vodzinskiy.backend.dto.UserResponse;
import vodzinskiy.backend.model.User;

import java.util.UUID;

public interface UserService {
    UserResponse createUser(UserRequest request);
    UserResponse editUser(UUID id, UserRequest request);
    User getUser(UUID id);
}
