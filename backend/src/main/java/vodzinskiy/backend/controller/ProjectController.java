package vodzinskiy.backend.controller;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vodzinskiy.backend.dto.ProjectResponse;
import vodzinskiy.backend.service.ProjectService;
import vodzinskiy.backend.service.UserService;

import java.util.UUID;

@RestController
@RequestMapping("/api/project")
@RequiredArgsConstructor
public class ProjectController {
    private final ProjectService projectService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(@RequestBody String name, HttpSession session) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                projectService.createProject(userService.getIdFromSession(session), name));
    }

    @PostMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public void joinProject(@PathVariable UUID id, HttpSession session) {
        projectService.joinProject(id, userService.getIdFromSession(session));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> getProject(@PathVariable UUID id) {
        return ResponseEntity.ok(projectService.getProjectById(id));
    }

    @PostMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public void deleteProject(@PathVariable UUID id, HttpSession session) {
        projectService.deleteProject(id, userService.getIdFromSession(session));
    }

}
