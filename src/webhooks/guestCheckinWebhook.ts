import { PolyWebhook } from "polyapi";

// PolyAPI configuration
export const polyConfig: PolyWebhook = {
    context: "demo",
    name: "guestCheckinWebhook",
    description: "Receives guest check-in information and emits an event to trigger the guest check-in process.",
    visibility: "TENANT",
    method: "POST",
    requirePolyApiKey: true,
    subpath: "guest-checkin",
    slug: "devdan",
    eventPayloadTypeSchema: {
        type: "object",
        properties: {
            guestName: {
                type: "string",
                description: "Name of the guest checking in.",
            },
            roomNumber: {
                type: "string",
                description: "Room number assigned to the guest.",
            },
            checkInTime: {
                type: "string",
                format: "date-time",
                description: "Check-in time in ISO 8601 format.",
            },
        },
        required: ["guestName", "roomNumber", "checkInTime"],
    },
    eventPayload: {
        guestName: "John Doe",
        roomNumber: "101",
        checkInTime: "2024-06-01T15:00:00Z",
    },
    responseStatus: 200,
    responsePayload: { message: "Guest check-in information received." },
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
