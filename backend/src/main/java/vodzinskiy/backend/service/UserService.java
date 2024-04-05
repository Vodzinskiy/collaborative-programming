package vodzinskiy.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vodzinskiy.backend.dto.UserRequest;
import vodzinskiy.backend.dto.UserResponse;
import vodzinskiy.backend.exception.AlreadyExistsException;
import vodzinskiy.backend.exception.NotFoundException;
import vodzinskiy.backend.mapper.UserMapper;
import vodzinskiy.backend.model.User;
import vodzinskiy.backend.repository.UserRepository;

import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Autowired
    public UserService(UserRepository userRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    public UserResponse createUser(UserRequest request) {
        throwIfUserExists(request.email(), "email");
        throwIfUserExists(request.username(), "username");

        User user = new User(request.username(), request.email(), request.password());
        userRepository.save(user);
        return new UserResponse(user.getId(), user.getUsername(), user.getEmail());
    }

    public User getUser(UUID id) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isEmpty()) {
            throw new NotFoundException(String.format("User with id %s not found", id));
        }
        return optionalUser.get();
    }

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
}
