package vodzinskiy.backend.dto;

import java.util.Set;
import java.util.UUID;

public record ProjectResponse(UUID id, String name, String owner, Set<String> members) {}
