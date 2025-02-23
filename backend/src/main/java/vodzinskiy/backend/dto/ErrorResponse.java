package vodzinskiy.backend.dto;

import java.time.LocalDateTime;

public record ErrorResponse(LocalDateTime timestamp, int status, String message) {
    public ErrorResponse(String message, int status) {
        this(LocalDateTime.now(), status, message);
    }
}
