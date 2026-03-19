import poly, { PolyServerFunction } from "polyapi";

// PolyAPI configuratoin
export const polyConfig: PolyServerFunction = {
    context: "demo.ohip",
    name: "processOhipEvents",
    description: "Process incoming OHIP events and send update to the Zoom API.",
    visibility: "TENANT",
    logsEnabled: true,
    serverSideAsync: true,
};

/**
 * Process incoming OHIP events and send update to the Zoom API.
 * @param {any} eventPayload - The incoming OHIP event payload (webhook/event notification data).
 * @returns {void}
 */
function processOhipEvents(eventPayload: any): void {
    console.log("Received OHIP event:", eventPayload);
}
