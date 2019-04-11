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
        Exec.cmd("/home/mastermind/csgo-multiserver/csgo-server @yeet start");
        Exec.cmd("echo 'aäsiogjiäüasufhgiawerihf'");
        Exec.cmd("echo 'aäsiogjiäüasufhgiawerihf'");
        Exec.cmd("echo 'aäsiogjiäüasufhgiawerihf'");
        Exec.cmd("echo 'aäsiogjiäüasufhgiawerihf'");
        Exec.cmd("echo 'aäsiogjiäüasufhgiawerihf'");
    }
}
