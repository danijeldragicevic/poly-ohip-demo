import { PolyWebhook } from "polyapi";
import guestCheckinSchema from "../schemas/guestCheckin.schema.json";

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
    eventPayloadTypeSchema: guestCheckinSchema,
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
