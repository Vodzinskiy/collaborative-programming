package vodzinskiy.backend.service;

import vodzinskiy.backend.dto.ProjectResponse;
import vodzinskiy.backend.model.Project;

import java.util.UUID;

public interface ProjectService {
    ProjectResponse createProject(UUID id, String name);
    Project getProject(UUID id);
    ProjectResponse getProjectById(UUID id);
    ProjectResponse updateProject(ProjectResponse project);
    void deleteProject(UUID projectId, UUID userId);
    void joinProject(UUID projectId, UUID userId);
}
