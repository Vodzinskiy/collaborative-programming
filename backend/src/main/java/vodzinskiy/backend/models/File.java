package vodzinskiy.backend.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class File {
    private UUID id;
    private String name;
    private String data;
    private List<File> content;
    private String path;
}
