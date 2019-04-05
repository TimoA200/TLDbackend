package core;

import libs.Exec;

public class Match extends Thread {

    public Match() {

    }

    @Override
    public void run() {
        super.run();
        Exec.cmd("/home/mastermind/csgo-multiserver/csgo-server @hey create");
        Exec.cmd("/home/mastermind/csgo-multiserver/csgo-server @hey start");
    }
}
