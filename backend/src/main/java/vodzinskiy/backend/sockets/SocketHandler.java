package vodzinskiy.backend.sockets;

import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.annotation.OnConnect;
import com.corundumstudio.socketio.annotation.OnDisconnect;
import com.corundumstudio.socketio.annotation.OnEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import vodzinskiy.backend.dto.ProjectObject;
import vodzinskiy.backend.model.File;

import java.util.*;

@Component
@RequiredArgsConstructor
@Slf4j
public class SocketHandler {
    private final SocketIOServer server;

    @OnConnect
    private void onConnect(SocketIOClient client) {
        String projectId = client.getHandshakeData().getSingleUrlParam("projectId");
        Collection<SocketIOClient> clients = server.getRoomOperations(projectId).getClients();
        Iterator<SocketIOClient> iterator = clients.iterator();
        if (clients.size() > 1) {
            SocketIOClient sourcedClient = iterator.next();
            if (sourcedClient.getSessionId().equals(client.getSessionId()) && iterator.hasNext()) {
                sourcedClient = iterator.next();
            }
            sourcedClient.sendEvent("requestFiles", client.getSessionId());
        }
        client.joinRoom(projectId);
    }

    @OnDisconnect
    private void onDisconnect(SocketIOClient client) {
        client.getAllRooms().stream().findFirst().ifPresent(client::leaveRoom);
    }

    @OnEvent("updateDocument")
    public void onUpdateDocument(SocketIOClient client, List<Map<String, Object>> change, UUID documentId) {
        String projectId = client.getHandshakeData().getSingleUrlParam("projectId");
        if (projectId != null) {
            server.getRoomOperations(projectId).getClients().stream()
                    .filter(c -> !c.getSessionId().equals(client.getSessionId()))
                    .forEach(c -> c.sendEvent("editorChanges", change, documentId));
        }
    }

    @OnEvent("files")
    public void onFiles(SocketIOClient client, List<File> files, String recipientId) {
        server.getClient(UUID.fromString(recipientId)).sendEvent("files", files);
    }

    @OnEvent("addFile")
    public void onAddFile(SocketIOClient client, ProjectObject object) {
        String projectId = client.getHandshakeData().getSingleUrlParam("projectId");
        if (projectId != null) {
            server.getRoomOperations(projectId).getClients().stream()
                    .filter(c -> !c.getSessionId().equals(client.getSessionId()))
                    .forEach(c -> c.sendEvent("addFile", object));
        }
    }

    @OnEvent("renameFile")
    public void onRenameFile(SocketIOClient client, String path, String newName) {
        String projectId = client.getHandshakeData().getSingleUrlParam("projectId");
        if (projectId != null) {
            server.getRoomOperations(projectId).getClients().stream()
                    .filter(c -> !c.getSessionId().equals(client.getSessionId()))
                    .forEach(c -> c.sendEvent("renameFile", path, newName));
        }
    }

    @OnEvent("removeFile")
    public void onRemoveFile(SocketIOClient client, String path) {
        String projectId = client.getHandshakeData().getSingleUrlParam("projectId");
        if (projectId != null) {
            server.getRoomOperations(projectId).getClients().stream()
                    .filter(c -> !c.getSessionId().equals(client.getSessionId()))
                    .forEach(c -> c.sendEvent("removeFile", path));
        }
    }
}