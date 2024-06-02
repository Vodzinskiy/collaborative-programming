package vodzinskiy.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import vodzinskiy.backend.models.Project;

import java.util.List;
import java.util.UUID;

public interface ProjectRepository extends JpaRepository<Project, UUID> {
    List<Project> findByOwnerId(UUID id);
    List<Project> findByMembersId(UUID id);
}
