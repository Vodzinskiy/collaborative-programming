package vodzinskiy.backend.controller;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vodzinskiy.backend.dto.UserRequest;
import vodzinskiy.backend.dto.UserResponse;
import vodzinskiy.backend.model.User;
import vodzinskiy.backend.repository.UserRepository;
import vodzinskiy.backend.service.UserService;

import java.util.UUID;


@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserRepository userRepository;
    private final UserService userService;

    @PostMapping("/auth/signup")
    public ResponseEntity<UserResponse> registerUser(@RequestBody UserRequest request) {
        UserResponse user = userService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    @GetMapping("/user")
    public ResponseEntity<UserResponse> getUserById(HttpSession session) {
        User user = userService.getUser(getUserId(session));
        return ResponseEntity.ok(new UserResponse(user.getId(), user.getUsername(), user.getEmail()));
    }

    @DeleteMapping("/user")
    public ResponseEntity<Void> deleteUserById(HttpSession session) {
        userService.getUser(getUserId(session));
        userRepository.deleteById(getUserId(session));
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/user")
    public ResponseEntity<UserResponse> updateUser(HttpSession session,
                                                   @RequestBody UserRequest userRequest) {
        UserResponse userResponse = userService.editUser(getUserId(session), userRequest);
        return ResponseEntity.ok(userResponse);
    }

    private UUID getUserId(HttpSession session) {
        return UUID.fromString(session.getAttribute("userID").toString());
    }
}
