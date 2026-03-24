import { createGuestCheckinTrigger } from "./guestCheckinTrigger";

// This file is the main entry point for creating/updating the trigger.
// Need this to be able to run `"setup:trigger": "ts-node src/triggers/createTrigger.ts"` via the Github Actions workflow.
createGuestCheckinTrigger().catch((error) => {
    console.error("Failed to create trigger:", error);
    process.exitCode = 1;
});
