package vodzinskiy.backend.service.impl;

import com.corundumstudio.socketio.SocketIOServer;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vodzinskiy.backend.dto.ProjectResponse;
import vodzinskiy.backend.dto.Role;
import vodzinskiy.backend.exception.AlreadyExistsException;
import vodzinskiy.backend.exception.ForbiddenException;
import vodzinskiy.backend.exception.NotFoundException;
import vodzinskiy.backend.model.Project;
import vodzinskiy.backend.model.User;
import vodzinskiy.backend.repository.ProjectRepository;
import vodzinskiy.backend.service.ProjectService;
import vodzinskiy.backend.service.UserService;

import java.util.*;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {
    private final ProjectRepository projectRepository;
    private final UserService userService;
    private final SocketIOServer server;

    @Override
    public ProjectResponse createProject(UUID ownerId, String name) {
        User owner = userService.getUser(ownerId);
        Project project = new Project(name, owner);
        projectRepository.save(project);
        return new ProjectResponse(project.getId(), project.getName(), owner.getUsername(), new HashSet<>(), Role.OWNER);
    }

    @Override
    public ProjectResponse joinProject(UUID projectId, UUID userId) {
        Project project = getProject(projectId);
        User user = userService.getUser(userId);
        if (project.getMembers().contains(user) || project.getOwner().getId().equals(userId)) {
            throw new AlreadyExistsException("You are already in the project");
        } else {
            project.addMember(user);
            projectRepository.save(project);
            updateMembersList(project);
            return projectToProjectResponse(project, userId);
        }
    }

    @Override
    public Project getProject(UUID id) {
        Optional<Project> project = projectRepository.findById(id);
        if (project.isEmpty()) {
            throw new NotFoundException(String.format("Project with id \"%s\" not found", id));
        }
        return project.get();
    }

    @Override
    public ProjectResponse getProjectById(UUID projectId, UUID userId) {
        Project project = getProject(projectId);
        return projectToProjectResponse(project, userId);
    }

    @Override
    public ProjectResponse updateProject(ProjectResponse project) {
        return null;
    }

    @Override
    public void deleteProject(UUID projectId, UUID userId) {
        if (!getProject(projectId).getOwner().getId().equals(userId)) {
            throw new ForbiddenException("Only the owner can delete a project");
        }
        server.getRoomOperations(projectId.toString()).sendEvent("projectUserListUpdated", new ArrayList<>());
        projectRepository.deleteById(projectId);
    }

    @Override
    public void leaveProject(UUID projectId, UUID userId) {
        Project project = getProject(projectId);
        project.removeMember(userId);
        projectRepository.save(project);
        updateMembersList(project);
    }

    private void updateMembersList(Project project) {
        List<String> memberNames = project.getMembers().stream()
                .map(User::getUsername)
                .collect(Collectors.toCollection(ArrayList::new));
        memberNames.addFirst(project.getOwner().getUsername());
        server.getRoomOperations(project.getId().toString()).sendEvent("projectUserListUpdated", memberNames);
    }

    private ProjectResponse projectToProjectResponse(Project project, UUID userId ) {
        Role role = Role.MEMBER;
        if (userId.equals(project.getOwner().getId())) {
            role = Role.OWNER;
        }
        Set<String> memberNames = project.getMembers().stream()
                .map(User::getUsername)
                .collect(Collectors.toSet());
        return new ProjectResponse(project.getId(),
                project.getName(),
                project.getOwner().getUsername(),
                memberNames,
                role
        );
    }
}
