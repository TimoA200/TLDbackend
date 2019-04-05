package core;

import libs.Exec;
import libs.Logger;

public class Match extends Thread {

    public Match() {

    }

    @Override
    public void run() {
        super.run();
        Exec.cmd("./match.sh");
    }
}
