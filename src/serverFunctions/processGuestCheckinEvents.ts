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
