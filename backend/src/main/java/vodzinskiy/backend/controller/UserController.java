package vodzinskiy.backend.controller;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vodzinskiy.backend.dto.UserRequest;
import vodzinskiy.backend.dto.UserResponse;
import vodzinskiy.backend.model.User;
import vodzinskiy.backend.repository.UserRepository;
import vodzinskiy.backend.service.UserService;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final UserService userService;

    @PostMapping("/auth/signup")
    public ResponseEntity<UserResponse> registerUser(@RequestBody UserRequest request) {
        UserResponse user = userService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    @GetMapping("/user")
    public ResponseEntity<UserResponse> getUser(HttpSession session) {
        User user = userService.getUser(userService.getIdFromSession(session));
        return ResponseEntity.ok(new UserResponse(user.getId(), user.getUsername(), user.getEmail()));
    }

    @DeleteMapping("/user")
    public ResponseEntity<Void> deleteUser(HttpSession session) {
        userService.getUser(userService.getIdFromSession(session));
        userRepository.deleteById(userService.getIdFromSession(session));
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/user")
    public ResponseEntity<UserResponse> updateUser(HttpSession session,
                                                   @RequestBody UserRequest userRequest) {
        UserResponse userResponse = userService.editUser(userService.getIdFromSession(session), userRequest);
        return ResponseEntity.ok(userResponse);
    }
}
