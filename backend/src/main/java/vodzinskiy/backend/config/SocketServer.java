package vodzinskiy.backend.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import com.corundumstudio.socketio.SocketIOServer;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SocketServer implements CommandLineRunner {

    private final SocketIOServer server;

    @Override
    public void run(String... args) {
        server.start();
    }
}


