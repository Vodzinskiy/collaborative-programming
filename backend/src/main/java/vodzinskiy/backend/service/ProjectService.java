package vodzinskiy.backend.service;

import vodzinskiy.backend.dto.ProjectResponse;
import vodzinskiy.backend.model.Project;

import java.util.UUID;

public interface ProjectService {
    ProjectResponse createProject(UUID id, String name);
    Project getProject(UUID id);
    ProjectResponse getProjectById(UUID projectId, UUID userId);
    ProjectResponse updateProject(ProjectResponse project);
    void deleteProject(UUID projectId, UUID userId);
    ProjectResponse joinProject(UUID projectId, UUID userId);
    void leaveProject(UUID projectId, UUID userId);
}
