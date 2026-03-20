import { describe, it, expect } from "vitest";
import { validateGuestCheckinEvent } from "../../src/serverFunctions/validateGuestCheckinEvent";

describe("validateGuestCheckinEvent (unit tests)", () => {
    it("should return true for a valid payload", async () => {
        const validPayload = {
            hotelId: "hotel_123",
            roomId: "room_456",
            checkInTime: "2024-06-01T15:00:00Z",
        };
        await expect(validateGuestCheckinEvent(validPayload)).resolves.toBe(true);
    });

    it("should reject when hotelId is missing", async () => {
        const invalidPayload = {
            roomId: "room_456",
            checkInTime: "2024-06-01T15:00:00Z",
        };
        await expect(validateGuestCheckinEvent(invalidPayload)).rejects.toMatchObject({
            message: "Invalid or missing required field: hotelId. Expected a non-empty string.",
            statusCode: 400,
            statusText: "Bad Request",
        });
    });

    it("should reject when roomId is missing", async () => {
        const invalidPayload = {
            hotelId: "hotel_123",
            checkInTime: "2024-06-01T15:00:00Z",
        };
        await expect(validateGuestCheckinEvent(invalidPayload)).rejects.toMatchObject({
            message: "Invalid or missing required field: roomId. Expected a non-empty string.",
            statusCode: 400,
            statusText: "Bad Request",
        });
    });

    it("should reject when checkInTime is missing", async () => {
        const invalidPayload = {
            hotelId: "hotel_123",
            roomId: "room_456",
        };
        await expect(validateGuestCheckinEvent(invalidPayload)).rejects.toMatchObject({
            message: "Invalid or missing required field: checkInTime. Expected a non-empty string.",
            statusCode: 400,
            statusText: "Bad Request",
        });
    });

    it("should reject when checkInTime is in an invalid format", async () => {
        const invalidPayload = {
            hotelId: "hotel_123",
            roomId: "room_456",
            checkInTime: "invalid-date-format",
        };
        await expect(validateGuestCheckinEvent(invalidPayload)).rejects.toMatchObject({
            message: "Invalid checkInTime format. Expected a valid ISO-8601 date-time string.",
            statusCode: 400,
            statusText: "Bad Request",
        });
    });
});
