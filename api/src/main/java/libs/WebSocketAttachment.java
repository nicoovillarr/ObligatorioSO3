package libs;

import java.util.LinkedList;
import java.util.List;
import java.util.UUID;

public class WebSocketAttachment {
    private final String uuid;
    private final String ip;
    private final List<String> channels = new LinkedList<>();

    public WebSocketAttachment(String ip) {
        this.uuid = UUID.randomUUID().toString();
        this.ip = ip;
    }

    public String getUuid() {
        return uuid;
    }

    public String getIp() {
        return ip;
    }

    public List<String> getChannels() {
        return new LinkedList<>(channels);
    }

    public void addChannel(String channel) {
        if (!channels.contains(channel)) {
            channels.add(channel);
        }
    }

    public void removeChannel(String channel) {
        if (channels.contains(channel)) {
            channels.remove(channel);
        }
    }
}