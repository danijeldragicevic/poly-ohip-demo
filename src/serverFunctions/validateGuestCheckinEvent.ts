import { PolyServerFunction } from "polyapi";

// PolyAPI configuratoin
export const polyConfig: PolyServerFunction = {
    context: "demo.ohip",
    name: "validateGuestCheckinEvent",
    description: "Validates the guest check-in event payload for required fields and correct formats.",
    visibility: "TENANT",
    logsEnabled: true,
    serverSideAsync: false
};

/**
 * Validates the guest check-in event payload for required fields and correct formats.
 * @param {any} eventPayload - The guest check-in event payload to validate. Must be an object containing `hotelId`, `roomId`, and `checkInTime` as non-empty strings, where `checkInTime` must be a valid ISO-8601 date-time; otherwise the function rejects with a 400 Bad Request error.
 * @returns {Promise<boolean>} 
 */
export function validateGuestCheckinEvent(eventPayload: any): Promise<boolean> {
    const requiredFields = ["hotelId", "roomId", "checkInTime"];

    for (const field of requiredFields) {
        if (!eventPayload[field] || typeof eventPayload[field] !== "string" || eventPayload[field].trim() === "") {
            return Promise.reject({
                message: `Invalid or missing required field: ${field}. Expected a non-empty string.`,
                statusCode: 400,
                statusText: "Bad Request",
            });
        }
    }

    // Validate checkInTime format (ISO-8601)
    const checkInTime = new Date(eventPayload.checkInTime);
    if (isNaN(checkInTime.getTime())) {
        return Promise.reject({
            message: "Invalid checkInTime format. Expected a valid ISO-8601 date-time string.",
            statusCode: 400,
            statusText: "Bad Request",
        });
    }
    return Promise.resolve(true);
}
