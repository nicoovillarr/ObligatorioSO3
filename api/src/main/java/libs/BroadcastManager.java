package libs;

import java.net.InetSocketAddress;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;

import com.google.gson.Gson;
import com.google.gson.internal.LinkedTreeMap;

public class BroadcastManager extends WebSocketServer {
    private static final Set<WebSocket> clients = Collections.synchronizedSet(new HashSet<>());
    private static final Gson gson = new Gson();
    private Runnable onStarted;

    public BroadcastManager(int port) {
        super(new InetSocketAddress(port));
        System.out.println("Inicializando WebSocket en el puerto " + port);
    }

    public void init(Runnable onStarted) {
        super.start();
        this.onStarted = onStarted;
    }

    @Override
    public void onStart() {
        System.out.println("WebSocket iniciado en " + getAddress());
        if (onStarted != null) {
            onStarted.run();
        }
    }

    @Override
    public void onOpen(WebSocket conn, ClientHandshake handshake) {
        String ip = conn.getRemoteSocketAddress().getAddress().getHostAddress();

        WebSocketAttachment client = new WebSocketAttachment(ip);
        conn.setAttachment(client);

        clients.add(conn);

        System.out.println("Cliente conectado: " + conn.getRemoteSocketAddress() + " con UUID: " + client.getUuid());
    }

    @Override
    public void onClose(WebSocket conn, int code, String reason, boolean remote) {
        clients.remove(conn);
        System.out.println("Cliente desconectado.");
    }

    @Override
    public void onMessage(WebSocket conn, String message) {
        if (conn == null || message == null || message.isEmpty()) {
            return;
        }

        Map<String, String> receivedMessage = gson.fromJson(message, HashMap.class);
        String type = receivedMessage.get("type").toLowerCase();
        LinkedTreeMap<String, String> dataMap = receivedMessage.get("data") != null
                ? gson.fromJson(gson.toJson(receivedMessage.get("data")), LinkedTreeMap.class)
                : null;

        switch (type) {
            case "subscribe_channel" -> {
                WebSocketAttachment attachment = conn.getAttachment();
                if (attachment != null && dataMap != null) {
                    attachment.addChannel(dataMap.get("channel"));
                    System.out.println(
                            "Cliente " + attachment.getUuid() + " suscrito al canal: " +
                                    dataMap.get("channel"));

                    HashMap<String, String> payload = new HashMap<>();
                    payload.put("type", "SUBSCRIBED_CHANNEL");
                    payload.put("message", "Suscripción exitosa al canal: " + dataMap.get("channel"));
                    send(conn, gson.toJson(payload));
                }
            }
            case "unsuscribe_channel" -> {
                WebSocketAttachment attachment = conn.getAttachment();
                if (attachment != null && dataMap != null) {
                    attachment.removeChannel(dataMap.get("channel"));
                    System.out.println(
                            "Cliente " + attachment.getUuid() + " desuscrito del canal: " +
                                    dataMap.get("channel"));

                    HashMap<String, String> payload = new HashMap<>();
                    payload.put("type", "UNSUBSCRIBED_CHANNEL");
                    payload.put("message", "Desuscripción exitosa del canal: " + dataMap.get("channel"));
                    send(conn, gson.toJson(payload));
                }
            }

            case "ping" -> {
                HashMap<String, String> payload = new HashMap<>();
                payload.put("message", "pong");
                send(conn, gson.toJson(payload));
            }

            default -> System.out.println("Acción desconocida recibida: " + type);
        }
    }

    @Override
    public void onError(WebSocket conn, Exception ex) {
        if (ex != null) {
            System.out.println("WebSocket error: " + ex.getMessage());
        }
    }

    public static void send(String channel, String action, Object obj) {
        System.out.print("[WebSocket]: '" + action + "' to channel '" + channel + "'");
        if (obj != null)
            System.out.print(" - Payload: " + gson.toJson(obj));
        System.out.println();

        WebSocket[] snapshot = BroadcastManager.getClientsSnapshot(channel);

        Map<String, String> payload = new HashMap<String, String>();
        payload.put("channel", channel);
        payload.put("action", action);
        if (obj != null) {
            payload.put("data_type", obj.getClass().getSimpleName());
            payload.put("data", gson.toJson(obj));
        }

        String jsonPayload = gson.toJson(payload);

        for (WebSocket conn : snapshot)
            send(conn, jsonPayload);
    }

    private static void send(WebSocket socket, String jsonPayload) {
        try {
            if (socket != null && socket.isOpen()) {
                socket.send(jsonPayload);
            } else {
                synchronized (clients) {
                    clients.remove(socket);
                }
            }
        } catch (Exception e) {
            System.out.println("Mensaje de error: " + e.getMessage());
            synchronized (clients) {
                clients.remove(socket);
            }
        }
    }

    private static WebSocket[] getClientsSnapshot(String channel) {
        synchronized (clients) {
            return clients
                    .stream()
                    .filter((x) -> x.getAttachment() != null &&
                            ((WebSocketAttachment) x.getAttachment()).getChannels().contains(channel))
                    .toArray(WebSocket[]::new);
        }
    }
}
