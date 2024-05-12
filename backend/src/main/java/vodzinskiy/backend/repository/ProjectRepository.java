package vodzinskiy.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vodzinskiy.backend.model.Project;

import java.util.UUID;

public interface ProjectRepository extends JpaRepository<Project, UUID> {
}
