package vodzinskiy.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true)
    private String email;

    @Column(unique = true)
    private String providerId;

    private String password;

    public User(String username, String email, String password, String providerId) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.providerId = providerId;
    }
}
