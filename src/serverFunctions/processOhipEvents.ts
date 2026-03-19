import { PolyServerFunction } from "polyapi";

// PolyAPI configuratoin
export const polyConfig: PolyServerFunction = {
    context: "ohip",
    name: "processOhipEvents",
    description: "Process incoming OHIP events and send update to the Zoom API.",
    visibility: "TENANT",
    logsEnabled: true,
    serverSideAsync: true,
};

/**
 * Process incoming OHIP events and send update to the Zoom API.
 * @param {any} eventPayload - The raw incoming OHIP webhook event payload to ingest. Contains the event type/notification (e.g., patient check-in), associated timestamps, patient and clinic metadata, and any identifiers needed to log the event for auditing/troubleshooting and to forward corresponding status updates to the Zoom API.
 * @returns {Promise<void>}
 */
export async function processOhipEvents(eventPayload: any): Promise<void> {
    console.log("Received OHIP event:", eventPayload);
}

//Example usage
// processOhipEvents({
//     eventName: "check_in",
//     patientId: "12345",
//     timestamp: "2024-06-01T12:00:00Z",
//     additionalData: {
//         clinicLocation: "Toronto General Hospital",
//         physician: "Dr. Smith",
//     },
// });
