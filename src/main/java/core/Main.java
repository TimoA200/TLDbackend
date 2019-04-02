package core;

import java.net.UnknownHostException;

public class Main {

    public static Websocket websocket;

    public static void main(String[] args) throws UnknownHostException {

        websocket = new Websocket(Settings.WebsocketPort);
        websocket.start();
    }
}
