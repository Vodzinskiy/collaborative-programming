package vodzinskiy.backend.dto;

import java.util.UUID;

public record ProjectObject(UUID id, String type, String path, String name, String content, String fPath) {}
