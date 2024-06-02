package vodzinskiy.backend.config;

import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.annotation.SpringAnnotationScanner;
import com.corundumstudio.socketio.store.RedissonStoreFactory;
import org.redisson.Redisson;
import org.redisson.config.Config;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class WebSocketConfig  {

    @Value("${socket-server.host}")
    private String host;

    @Value("${socket-server.port}")
    private Integer port;

    @Value("${REDIS_URL}")
    private String redisUrl;

    @Bean
    public SocketIOServer socketIOServer() {
        com.corundumstudio.socketio.Configuration conf = new com.corundumstudio.socketio.Configuration();
        conf.setHostname(host);
        conf.setPort(port);

        Config redissonConfig = new Config();
        redissonConfig.useSingleServer().setAddress(redisUrl);
        Redisson redisson = (Redisson) Redisson.create(redissonConfig);
        RedissonStoreFactory redisStoreFactory = new RedissonStoreFactory(redisson);

        conf.setStoreFactory(redisStoreFactory);
        return new SocketIOServer(conf);
    }

    @Bean
    public SpringAnnotationScanner springAnnotationScanner() {
        return new SpringAnnotationScanner(socketIOServer());
    }
}