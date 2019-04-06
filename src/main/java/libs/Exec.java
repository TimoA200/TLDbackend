package libs;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class Exec {

    public static void cmd(String command) {
        cmd(command, true);
    }

    public static void cmd(String command, boolean wait) {
        try {
            Process proc = Runtime.getRuntime().exec(command);
            BufferedReader buf = new BufferedReader(new InputStreamReader(proc.getInputStream()));
            String line = "";
            String output = "";

            while((line = buf.readLine()) != null) {
                output += line + "\n";
            }

            Logger.log(output);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
