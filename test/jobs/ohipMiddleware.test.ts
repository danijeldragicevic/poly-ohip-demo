import { describe, it, expect, vi } from "vitest";
import { handleOhipEvent } from "../../src/jobs/ohipMiddleware";

describe("handleOhipEvent", () => {
    it("should log the received OHIP event payload", async () => {
        const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});

        const mockEventPayload = {
            metadata: {
                uniqueEventId: "event123",
            },
            moduleName: "RESERVATION",
            eventName: "CHECK IN",
            detail: [
                { dataElement: "ROOM_NUMBER", newValue: "101" },
                { dataElement: "CHECK_IN_TIME", newValue: "2024-06-01T12:00:00Z" },
            ],
        };

        await handleOhipEvent(mockEventPayload);

        expect(consoleLogSpy).toHaveBeenCalledWith("Received OHIP event:", mockEventPayload);

        consoleLogSpy.mockRestore();
    });

    it("should transform an eligible check-in event", async () => {
        const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});

        const mockEventPayload = {
            metadata: {
                uniqueEventId: "event123",
            },
            moduleName: "RESERVATION",
            eventName: "CHECK IN",
            primaryKey: "reservation-123",
            detail: [
                { dataElement: "ROOM_NUMBER", newValue: "101" },
                { dataElement: "CHECK_IN_TIME", newValue: "2024-06-01T12:00:00Z" },
            ],
        };

        const result = await handleOhipEvent(mockEventPayload, "HOTEL_1");

        expect(result).toEqual({
            hotelId: "HOTEL_1",
            roomId: "101",
            checkInTime: "2024-06-01T12:00:00.000Z",
            reservationId: "reservation-123",
            eventId: "event123",
            source: "OHIP_MIDDLEWARE_MOCK",
        });

        consoleLogSpy.mockRestore();
    });

    it("should return null for non-check-in events", async () => {
        const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});

        const mockEventPayload = {
            metadata: {
                uniqueEventId: "event124",
            },
            moduleName: "HOUSEKEEPING",
            eventName: "ROOM READY",
            detail: [{ dataElement: "ROOM_NUMBER", newValue: "101" }],
        };

        const result = await handleOhipEvent(mockEventPayload, "HOTEL_1");

        expect(result).toBeNull();

        consoleLogSpy.mockRestore();
    });
});
