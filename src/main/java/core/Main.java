package core;

import java.io.IOException;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.List;

public class Main {

    public static Websocket websocket;

    public static List<Match> matches = new ArrayList<>();

    public static void main(String[] args) throws UnknownHostException {

        websocket = new Websocket(Settings.WebsocketPort);
        websocket.start();
    }
}
