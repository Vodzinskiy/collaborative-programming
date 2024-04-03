package vodzinskiy.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import vodzinskiy.backend.dto.request.UserRegistrationRequest;
import vodzinskiy.backend.model.User;
import vodzinskiy.backend.repository.UserRepository;

@RestController
public class UserController {

    private final UserRepository userRepository;

    @Autowired
    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/signup")
    public ResponseEntity<User> registerUser(@RequestBody UserRegistrationRequest request) {
        User user = new User(request.username(), request.email(), request.password());
        userRepository.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }
}
