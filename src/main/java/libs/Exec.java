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

            if(wait) {
                proc.waitFor();
                BufferedReader buf = new BufferedReader(new InputStreamReader(proc.getInputStream()));
                String line = "";
                String output = "";

                while ((line = buf.readLine()) != null) {
                    output += line + "\n";
                }

                Logger.log(output);
            }
            proc.destroy();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
