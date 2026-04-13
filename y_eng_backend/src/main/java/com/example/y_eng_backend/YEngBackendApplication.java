package com.example.y_eng_backend;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.File;
import java.net.URISyntaxException;

@SpringBootApplication
public class YEngBackendApplication {

    public static void main(String[] args) {
        Dotenv dotenv = loadDotenv();

        // Put .env values into System properties so Spring can read ${...}
        System.setProperty("DB_URL",         dotenv.get("DB_URL", ""));
        System.setProperty("DB_USERNAME",    dotenv.get("DB_USERNAME", ""));
        System.setProperty("DB_PASSWORD",    dotenv.get("DB_PASSWORD", ""));
        System.setProperty("GEMINI_API_KEY", dotenv.get("GEMINI_API_KEY", ""));

        SpringApplication.run(YEngBackendApplication.class, args);
    }

    /**
     * Loads .env from the current working directory first (IntelliJ / mvnw).
     * Falls back to the project root resolved from the compiled class location
     * (VS Code, Antigravity, or any runner that uses the workspace root as CWD).
     *
     * Compiled classes live at:  .../y_eng_backend/target/classes/
     * Two levels up gives us:    .../y_eng_backend/   <-- where .env lives
     */
    private static Dotenv loadDotenv() {
        // 1st attempt: current working directory
        Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
        if (!dotenv.get("DB_URL", "").isEmpty()) {
            return dotenv;
        }

        // 2nd attempt: project root resolved from class location
        try {
            File classesDir = new File(
                YEngBackendApplication.class
                    .getProtectionDomain()
                    .getCodeSource()
                    .getLocation()
                    .toURI()
            );
            // classesDir = target/classes  →  parent = target  →  parent = project root
            File projectRoot = classesDir.getParentFile().getParentFile();
            return Dotenv.configure()
                    .directory(projectRoot.getAbsolutePath())
                    .ignoreIfMissing()
                    .load();
        } catch (URISyntaxException e) {
            return dotenv; // return empty dotenv as last resort
        }
    }
}

