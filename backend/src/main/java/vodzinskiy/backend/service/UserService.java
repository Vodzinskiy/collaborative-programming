package vodzinskiy.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vodzinskiy.backend.dto.RegistrationRequest;
import vodzinskiy.backend.dto.UserDto;
import vodzinskiy.backend.exception.AlreadyExistsException;
import vodzinskiy.backend.exception.NotFoundException;
import vodzinskiy.backend.model.User;
import vodzinskiy.backend.repository.UserRepository;

import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {
    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserDto createUser(RegistrationRequest request) {
        throwIfUserExists(request.email(), "email");
        throwIfUserExists(request.username(), "username");

        User user = new User(request.username(), request.email(), request.password());
        userRepository.save(user);
        return new UserDto(user.getId(), user.getUsername(), user.getEmail());
    }

    public UserDto getUser(UUID id) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isEmpty()) {
            throw new NotFoundException(String.format("User with id %s not found", id));
        }
        User user = optionalUser.get();
        return new UserDto(user.getId(), user.getUsername(), user.getEmail());
    }

    private void throwIfUserExists(String value, String fieldName) {
        if (userRepository.existsByEmailOrUsername(value, value)) {
            throw new AlreadyExistsException(String.format("User with %s \"%s\" already exists", fieldName, value));
        }
    }
}
