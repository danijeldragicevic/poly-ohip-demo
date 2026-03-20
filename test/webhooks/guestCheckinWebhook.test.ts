import { describe, it, expect } from "vitest";
import { polyConfig } from "../../src/webhooks/guestCheckinWebhook";

describe("guestCheckinWebhook", () => {
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
        expect(polyConfig.eventPayloadTypeSchema.properties.source.enum).toEqual([
            "OHIP_MIDDLEWARE_MOCK",
            "OHIP_MIDDLEWARE_PROD",
        ]);
    });

    it("should return a 200 response with a JSON content-type", () => {
        expect(polyConfig.responseStatus).toBe(200);
        expect(polyConfig.responseHeaders["Content-Type"]).toBe("application/json");
        expect(polyConfig.responsePayload).toBeDefined();
    });

    it("should have one security function defined", () => {
        expect(polyConfig.securityFunctions).toBeDefined();
        expect(polyConfig.securityFunctions.length).toBe(1);
        expect(polyConfig.securityFunctions[0].id).toBe("f83d10f9-1602-4fc0-9668-298aacaf2742");
    });
});
