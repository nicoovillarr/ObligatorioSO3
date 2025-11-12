import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import libs.BroadcastManager;
import libs.Environment;

@SpringBootApplication(scanBasePackages = "features")
public class Main {
    public static void main(String[] args) {
        Environment.init();

        int port = Environment.getInt("WS_PORT", 8081);

        BroadcastManager webSocketServer = new BroadcastManager(port);
        webSocketServer.init(() -> {
            SpringApplication.run(Main.class, args);
        });
    }
}
