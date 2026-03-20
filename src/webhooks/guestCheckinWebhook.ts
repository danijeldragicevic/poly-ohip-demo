import { PolyWebhook } from "polyapi";

// PolyAPI configuration
export const polyConfig: PolyWebhook = {
    context: "demo.ohip",
    name: "guestCheckinWebhook",
    description: "Receives guest check-in information and emits an event to trigger the guest check-in process.",
    visibility: "TENANT",
    method: "POST",
    requirePolyApiKey: true,
    subpath: "guest-checkin",
    slug: "devdan",
    eventPayloadTypeSchema: {
        $schema: "https://json-schema.org/draft/2020-12/schema",
        $id: "https://example.com/schemas/guest-checkin-input.json",
        title: "Guest Check-In Webhook Input",
        type: "object",
        additionalProperties: false,
        required: ["hotelId", "roomId", "checkInTime"],
        properties: {
            hotelId: {
                type: "string",
                minLength: 1,
                description: "OHIP hotel/property identifier.",
            },
            roomId: {
                type: "string",
                minLength: 1,
                description: "Assigned room identifier/number used to map to Zoom common area phone.",
            },
            checkInTime: {
                type: "string",
                format: "date-time",
                description: "Guest check-in timestamp in ISO-8601 UTC (recommended).",
            },

            reservationId: {
                type: "string",
                minLength: 1,
                description: "Optional but recommended for traceability.",
            },
            eventId: {
                type: "string",
                minLength: 1,
                description: "Optional idempotency key from middleware/OHIP unique event id.",
            },
            source: {
                type: "string",
                enum: ["OHIP_MIDDLEWARE_MOCK", "OHIP_MIDDLEWARE_REAL"],
                description: "Optional event source marker.",
            },
        },
    },
    responseStatus: 200,
    responsePayload: { message: "Guest check-in event received." },
    responseHeaders: {
        "Content-Type": "application/json",
    },
    xmlParserOptions: {
        enabled: false,
        explicitArray: false,
        trim: false,
        normalizeTags: false,
    },
    securityFunctions: [],
};
