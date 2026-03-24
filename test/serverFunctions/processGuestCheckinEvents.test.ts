import { describe, it, expect, vi } from "vitest";
import { processGuestCheckinEvents } from "../../src/serverFunctions/processGuestCheckinEvents";

describe("processGuestCheckinEvents", () => {
    it("should log the received OHIP event payload", async () => {
        const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});

        const mockEventPayload = {
            eventType: "patient_check_in",
            timestamp: "2024-06-01T12:00:00Z",
            patientId: "12345",
            clinicId: "67890",
        };

        await processGuestCheckinEvents(mockEventPayload);

        expect(consoleLogSpy).toHaveBeenCalledWith("Received OHIP event:", mockEventPayload);

        consoleLogSpy.mockRestore();
    });
});
