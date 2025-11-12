package libs;

import io.github.cdimascio.dotenv.Dotenv;

public class Environment {
    private static Dotenv dotenv;

    public Environment() {
    }

    public static void init() {
        dotenv = Dotenv.load();
    }

    public static String getString(String key, String defaultValue) {
        String value = dotenv.get(key);
        if (value != null) {
            return value;
        } else if (defaultValue != null) {
            return defaultValue;
        } else {
            throw new IllegalArgumentException(getErrorMessage(key));
        }
    }

    public static int getInt(String key, Integer defaultValue) throws NumberFormatException {
        String value = dotenv.get(key);
        if (value != null) {
            try {
                return Integer.parseInt(value);
            } catch (NumberFormatException e) {
                if (defaultValue != null) {
                    return defaultValue;
                } else {
                    throw e;
                }
            }
        } else if (defaultValue != null) {
            return defaultValue;
        } else {
            throw new NumberFormatException(getErrorMessage(key));
        }
    }

    private static String getErrorMessage(String key) {
        return key + " no está definido en el entorno y no se proporcionó un valor predeterminado.";
    }
}