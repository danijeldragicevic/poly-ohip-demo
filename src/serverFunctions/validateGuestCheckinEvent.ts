// Poly deployed @ 2026-03-20T12:19:23.980Z - demo.ohip.validateGuestCheckinEvent - https://na1.polyapi.io/canopy/polyui/collections/server-functions/f83d10f9-1602-4fc0-9668-298aacaf2742 - 650a064e
import { PolyServerFunction } from "polyapi";

// PolyAPI configuratoin
export const polyConfig: PolyServerFunction = {
    context: "demo.ohip",
    name: "validateGuestCheckinEvent",
    description: "Validates the guest check-in event payload for required fields and correct formats.",
    visibility: "TENANT",
    logsEnabled: true,
    serverSideAsync: false,
};

/**
 * Validates the guest check-in event payload for required fields and correct formats.
 * @param {any} eventPayload - The guest check-in event payload to validate.
 *                             Must be an object containing `hotelId`, `roomId`, and `checkInTime` as non-empty strings,
 *                             where `checkInTime` must be a valid ISO-8601 date-time; otherwise the function returns false.
 *
 * @returns {boolean} Returns true if the payload is valid, otherwise false.
 */
export function validateGuestCheckinEvent(eventPayload: any): boolean {
    const requiredFields = ["hotelId", "roomId", "checkInTime"];

    for (const field of requiredFields) {
        if (!eventPayload[field] || typeof eventPayload[field] !== "string" || eventPayload[field].trim() === "") {
            return false;
        }
    }

    // Validate checkInTime format (ISO-8601)
    const checkInTime = new Date(eventPayload.checkInTime);
    if (isNaN(checkInTime.getTime())) {
        return false;
    }

    return true;
}
