import { runOhipMiddlewareFromEnv } from "./ohipMiddleware";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

runOhipMiddlewareFromEnv().catch((error) => {
    console.error("OHIP middleware failed:", error);
    process.exitCode = 1;
});
