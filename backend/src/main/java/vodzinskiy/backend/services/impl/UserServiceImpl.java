package vodzinskiy.backend.services.impl;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import vodzinskiy.backend.dto.UserRequest;
import vodzinskiy.backend.dto.UserResponse;
import vodzinskiy.backend.exceptions.AlreadyExistsException;
import vodzinskiy.backend.exceptions.ForbiddenException;
import vodzinskiy.backend.exceptions.NotFoundException;
import vodzinskiy.backend.mappers.UserMapper;
import vodzinskiy.backend.models.Project;
import vodzinskiy.backend.models.User;
import vodzinskiy.backend.repositories.ProjectRepository;
import vodzinskiy.backend.repositories.UserRepository;
import vodzinskiy.backend.services.ProjectService;
import vodzinskiy.backend.services.UserService;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final ProjectService projectService;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponse createUser(UserRequest request) {
        checkEmailExists(request.email());
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
        if (!user.getEmail().equals(request.email())) {
            checkEmailExists(request.email());
        }
        userMapper.updateUserFromUserRequest(request, user);
        if (request.password() != null && !request.password().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.password()));
        }
        userRepository.save(user);
        return new UserResponse(user.getId(), user.getUsername(), user.getEmail());
    }

    public void checkEmailExists(String email) {
        if (userRepository.existsByEmail(email)) {
            throw new AlreadyExistsException(String.format("User with email \"%s\" already exists", email));
        }
    }

    public UUID getIdFromSession(HttpSession session) {
        try {
            return UUID.fromString(session.getAttribute("userID").toString());
        } catch (Exception e) {
            throw new ForbiddenException("You must be authenticated for this action");
        }
    }

    @Override
    public void deleteUser(UUID id) {
        getUser(id);
        List<Project> ownedProjects = projectRepository.findByOwnerId(id);
        for (Project project : ownedProjects) {
            projectService.deleteProject(project.getId(), id);
        }
        List<Project> joinedProjects = projectRepository.findByMembersId(id);
        for (Project project : joinedProjects) {
            projectService.leaveProject(project.getId(), id);
        }
        userRepository.deleteById(id);
    }
}
