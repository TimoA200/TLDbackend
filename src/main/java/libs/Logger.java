package libs;

import java.text.SimpleDateFormat;
import java.util.Date;

public class Logger {

    public enum LogLvl {DEBUG, INFO_, WARN_, ERROR, FATAL}

    public static void log(LogLvl lvl, Object message) {
        var format = new SimpleDateFormat("HH:mm:ss");
        String color = "";

        switch(lvl) {
            case ERROR:
                color = "\033[0;31m";
                break;
            case FATAL:
                color = "\033[1;31m";
                break;
            default:
                break;
        }

        System.out.println(color + format.format(new Date()) + "   " + lvl.name().replace("_", " ") + "   " + message.toString());
    }

    public static void log(Object message) {
        log(LogLvl.INFO_, message);
    }
}
