// Poly deployed @ 2026-03-24T16:19:14.132Z - demo.ohip.processGuestCheckinEvents - https://na1.polyapi.io/canopy/polyui/collections/server-functions/ef042071-64d0-4241-ae85-ab0cfdc8ed5f - 59804039
import { PolyServerFunction } from "polyapi";

// PolyAPI configuratoin
export const polyConfig: PolyServerFunction = {
    context: "demo.ohip",
    name: "processGuestCheckinEvents",
    description: "Process incoming OHIP events and send update to the Zoom API.",
    visibility: "TENANT",
    logsEnabled: true,
    serverSideAsync: true,
};

/**
 * Process incoming OHIP events and send update to the Zoom API.
 * @param {any} eventPayload - Payload of the incoming OHIP event. The structure may vary, so it's typed as 'any' for flexibility.
 * @returns {Promise<void>}
 */
export async function processGuestCheckinEvents(eventPayload: any): Promise<void> {
    console.log("Received OHIP event:", eventPayload);

    //TODO implement processing logic here...
}
