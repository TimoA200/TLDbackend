package core;

import libs.Exec;
import libs.Logger;

public class Match extends Thread {

    public Match() {

    }

    @Override
    public void run() {
        super.run();
        Exec.cmd("/home/mastermind/csgo-multiserver/csgo-server @hey create");
        Logger.log("test");
        Exec.cmd("rpl '${GSLT-\"\"}' '${GSLT-\"8A3477957A706E4C923FFDF0C757265E\"}' /root/csgo@hey/msm.d/cfg/server.conf");
    }
}
