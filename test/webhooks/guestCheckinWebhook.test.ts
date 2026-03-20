import { describe, it, expect } from "vitest";
import { polyConfig } from "../../src/webhooks/guestCheckinWebhook";

describe("guestCheckinWebhook (unit tests)", () => {
    it("should have the correct polyConfig identity", () => {
        expect(polyConfig.context).toBe("demo.ohip");
        expect(polyConfig.name).toBe("guestCheckinWebhook");
        expect(polyConfig.method).toBe("POST");
        expect(polyConfig.visibility).toBe("TENANT");
        expect(polyConfig.slug).toBe("devdan");
    });

    it("should define an eventPayloadTypeSchema (not eventPayload)", () => {
        expect(polyConfig.eventPayload).toBeDefined();
        expect(polyConfig.eventPayloadTypeSchema).toBeDefined();
    });

    it("should require guestName, roomNumber, and checkInTime in the event payload schema", () => {
        const schema = polyConfig.eventPayloadTypeSchema as Record<string, any>;
        expect(schema.type).toBe("object");
        expect(schema.required).toContain("guestName");
        expect(schema.required).toContain("roomNumber");
        expect(schema.required).toContain("checkInTime");
        expect(schema.properties.guestName.type).toBe("string");
        expect(schema.properties.roomNumber.type).toBe("string");
        expect(schema.properties.checkInTime.type).toBe("string");
        expect(schema.properties.checkInTime.format).toBe("date-time");
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
