package vodzinskiy.backend.sockets;

import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.annotation.OnConnect;
import com.corundumstudio.socketio.annotation.OnDisconnect;
import com.corundumstudio.socketio.annotation.OnEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import vodzinskiy.backend.dto.SocketChangeDto;

import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class SocketHandler {
    //private final Map<String, StringBuffer> documents = new ConcurrentHashMap<>();

    private final SocketIOServer server;

    @OnConnect
    private void onConnect(SocketIOClient client) {
        String projectId = client.getHandshakeData().getSingleUrlParam("projectId");
        client.joinRoom(projectId);
    }

    @OnDisconnect
    private void onDisconnect(SocketIOClient client) {
        client.getAllRooms().stream().findFirst().ifPresent(client::leaveRoom);
    }

    @OnEvent("updateDocumentChar")
    public void onUpdateDocument(SocketIOClient client, SocketChangeDto change, UUID documentId) {
        /*StringBuffer document = documents.computeIfAbsent(documentId, k -> new StringBuffer());
        if (change.length() > 0) {
            document.insert(change.position(), change.content());
        } else {
            document.delete(change.position() + 1, change.position() + Math.abs(change.length()) + 1);
        }
        log.info(document.toString());*/

        for (SocketIOClient c : server.getAllClients()) {
            if (!c.getSessionId().equals(client.getSessionId())) {
                c.sendEvent("documentUpdatedChar", change);
            }
        }

        //server.getBroadcastOperations().sendEvent("documentUpdatedChar", change);
    }
}