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

function processOhipEvents(eventPayload: any): void {
    console.log("Received OHIP event:", eventPayload);
}
