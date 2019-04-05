package core;

import libs.Logger;
import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;

import java.net.InetSocketAddress;
import java.net.UnknownHostException;

public class Websocket extends WebSocketServer {

    private int port;

    public Websocket(int port) throws UnknownHostException {
        super(new InetSocketAddress(port));
        this.port = port;
    }
    @Override
    public void onOpen(WebSocket conn, ClientHandshake handshake) {
        conn.send("Welcome to the server!");
        broadcast("new connection: " + handshake.getResourceDescriptor());
        Logger.log(conn.getRemoteSocketAddress().getAddress().getHostAddress() + ": has connected!");
    }

    @Override
    public void onClose(WebSocket conn, int code, String reason, boolean remote) {
        broadcast(conn + "has disconnected!");
        Logger.log(conn + " has disconnected!");
    }

    @Override
    public void onMessage(WebSocket conn, String message) {
        broadcast(message);
        Logger.log(conn + ": " + message);
        process(message);
    }

    @Override
    public void onError(WebSocket conn, Exception ex) {
        ex.printStackTrace();
    }

    @Override
    public void onStart() {
        Logger.log("Started WebSocket on Port: " + port);
        setConnectionLostTimeout(0);
        setConnectionLostTimeout(100);
    }

    private void process(String message) {
        switch (message) {
            case "create match":
                Match match = new Match();
                match.run();
                Main.matches.add(match);
        }
    }
}
