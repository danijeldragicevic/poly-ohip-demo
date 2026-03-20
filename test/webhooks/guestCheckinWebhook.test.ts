import { describe, it, expect } from "vitest";
import { polyConfig } from "../../src/webhooks/guestCheckinWebhook";

describe("guestCheckinWebhook (unit tests)", () => {
    it("should have the correct polyConfig identity", () => {
        expect(polyConfig.context).toBe("demo.ohip");
        expect(polyConfig.name).toBe("guestCheckinWebhook");
        expect(polyConfig.method).toBe("POST");
        expect(polyConfig.visibility).toBe("TENANT");
        expect(polyConfig.slug).toBe("devdan");
        expect(polyConfig.requirePolyApiKey).toBe(true);
    });

    it("should have the correct eventPayloadTypeSchema", () => {
        expect(polyConfig.eventPayloadTypeSchema).toBeDefined();
        expect(polyConfig.eventPayloadTypeSchema.$id).toBe("https://example.com/schemas/guest-checkin-input.json");
        expect(polyConfig.eventPayloadTypeSchema.title).toBe("Guest Check-In Webhook Input");
        expect(polyConfig.eventPayloadTypeSchema.type).toBe("object");
        expect(polyConfig.eventPayloadTypeSchema.required).toEqual(["hotelId", "roomId", "checkInTime"]);
        expect(polyConfig.eventPayloadTypeSchema.properties).toBeDefined();
        expect(polyConfig.eventPayloadTypeSchema.properties.hotelId).toBeDefined();
        expect(polyConfig.eventPayloadTypeSchema.properties.roomId).toBeDefined();
        expect(polyConfig.eventPayloadTypeSchema.properties.checkInTime).toBeDefined();
        expect(polyConfig.eventPayloadTypeSchema.properties.reservationId).toBeDefined();
        expect(polyConfig.eventPayloadTypeSchema.properties.eventId).toBeDefined();
        expect(polyConfig.eventPayloadTypeSchema.properties.source).toBeDefined();
    });

    it("should return a 200 response with a JSON content-type", () => {
        expect(polyConfig.responseStatus).toBe(200);
        expect(polyConfig.responseHeaders["Content-Type"]).toBe("application/json");
        expect(polyConfig.responsePayload).toBeDefined();
    });

    it("should have no security functions defined", () => {
        expect(polyConfig.securityFunctions).toBeDefined();
        expect(Array.isArray(polyConfig.securityFunctions)).toBe(true);
        expect(polyConfig.securityFunctions.length).toBe(0);
    });
});
