package vodzinskiy.backend.services;

import vodzinskiy.backend.dto.ProjectResponse;
import vodzinskiy.backend.models.Project;
import vodzinskiy.backend.models.User;

import java.util.UUID;

public interface ProjectService {
    ProjectResponse createProject(User owner, String name);
    Project getProject(UUID id);
    ProjectResponse getProjectById(UUID projectId, UUID userId);
    ProjectResponse updateProject(ProjectResponse project);
    void deleteProject(UUID projectId, UUID userId);
    ProjectResponse joinProject(UUID projectId, User user);
    void leaveProject(UUID projectId, UUID userId);
}
