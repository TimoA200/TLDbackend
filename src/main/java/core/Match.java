package core;

import libs.Exec;
import libs.Logger;

public class Match extends Thread {

    public Match() {

    }

    @Override
    public void run() {
        super.run();
        Exec.cmd("TLDbackend/match.sh yeet 8A3477957A706E4C923FFDF0C757265E");
        try {
            Logger.log("sleep 5000");
            sleep(5000);
            Exec.cmd("/home/mastermind/csgo-multiserver/csgo-server @yeet start");
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
