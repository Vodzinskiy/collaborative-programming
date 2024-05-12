package vodzinskiy.backend.service.impl;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import vodzinskiy.backend.dto.UserRequest;
import vodzinskiy.backend.dto.UserResponse;
import vodzinskiy.backend.exception.AlreadyExistsException;
import vodzinskiy.backend.exception.NotFoundException;
import vodzinskiy.backend.mapper.UserMapper;
import vodzinskiy.backend.model.User;
import vodzinskiy.backend.repository.UserRepository;
import vodzinskiy.backend.service.UserService;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponse createUser(UserRequest request) {
        throwIfUserExists(request.email(), "email");
        throwIfUserExists(request.username(), "username");

        User user = new User(request.username(), request.email(), passwordEncoder.encode(request.password()), null);
        userRepository.save(user);
        return new UserResponse(user.getId(), user.getUsername(), user.getEmail());
    }

    @Override
    public User getUser(UUID id) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isEmpty()) {
            throw new NotFoundException(String.format("User with id \"%s\" not found", id));
        }
        return optionalUser.get();
    }

    @Override
    public User getUserByEmail(String email) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            throw new NotFoundException(String.format("User with email \"%s\" not found", email));
        }
        return optionalUser.get();
    }

    @Override
    public UserResponse editUser(UUID id, UserRequest request) {
        User user = getUser(id);
        userMapper.updateUserFromUserRequest(request, user);
        userRepository.save(user);
        return new UserResponse(user.getId(), user.getUsername(), user.getEmail());
    }

    private void throwIfUserExists(String value, String fieldName) {
        if (userRepository.existsByEmailOrUsername(value, value)) {
            throw new AlreadyExistsException(String.format("User with %s \"%s\" already exists", fieldName, value));
        }
    }

    public UUID getIdFromSession(HttpSession session) {
        return UUID.fromString(session.getAttribute("userID").toString());
    }
}
