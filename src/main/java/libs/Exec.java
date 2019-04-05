package libs;

import java.io.IOException;

public class Exec {

    public static void cmd(String command) {
        cmd(command, true);
    }

    public static void cmd(String command, boolean wait) {
        try {
            Process proc = Runtime.getRuntime().exec(command);
            proc.waitFor();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
