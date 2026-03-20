import { describe, it, expect } from "vitest";
import { validateGuestCheckinEvent } from "../../src/serverFunctions/validateGuestCheckinEvent";

describe("validateGuestCheckinEvent", () => {
    it("should return true for a valid payload", () => {
        const validPayload = {
            hotelId: "hotel_123",
            roomId: "room_456",
            checkInTime: "2024-06-01T15:00:00Z",
        };
        expect(validateGuestCheckinEvent(validPayload)).toBe(true);
    });

    it("should return false when hotelId is missing", () => {
        const invalidPayload = {
            roomId: "room_456",
            checkInTime: "2024-06-01T15:00:00Z",
        };
        expect(validateGuestCheckinEvent(invalidPayload)).toBe(false);
    });

    it("should return false when roomId is missing", () => {
        const invalidPayload = {
            hotelId: "hotel_123",
            checkInTime: "2024-06-01T15:00:00Z",
        };
        expect(validateGuestCheckinEvent(invalidPayload)).toBe(false);
    });

    it("should return false when checkInTime is missing", () => {
        const invalidPayload = {
            hotelId: "hotel_123",
            roomId: "room_456",
        };
        expect(validateGuestCheckinEvent(invalidPayload)).toBe(false);
    });

    it("should return false when checkInTime is in an invalid format", () => {
        const invalidPayload = {
            hotelId: "hotel_123",
            roomId: "room_456",
            checkInTime: "invalid-date-format",
        };
        expect(validateGuestCheckinEvent(invalidPayload)).toBe(false);
    });
});
