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
        try {
            Runtime.getRuntime().exec("TLDbackend/match.sh yeet 8A3477957A706E4C923FFDF0C757265E").waitFor();
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
