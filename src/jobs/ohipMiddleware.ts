import rawOhipCheckinEvent from "./ohipCheckinEvent.example.json";
import dotenv from "dotenv";

dotenv.config();

// Define OHIP event type
type OhipCheckinEvent = {
    metadata?: {
        offset?: number;
        uniqueEventId?: string;
    };
    moduleName?: string;
    eventName?: string;
    primaryKey?: string;
    detail: Array<{
        dataElement?: string;
        oldValue?: string | null;
        newValue?: string | null;
    }>;
};

// Define the payload that Poly expects
type PolyCheckinEvent = {
    hotelId: string;
    roomId: string;
    checkInTime: string;
    reservationId?: string;
    eventId?: string;
    source: "OHIP_MIDDLEWARE_MOCK";
};

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------
function getEnv(name: string): string {
    const value = process.env[name]?.trim();
    if (!value) {
        throw new Error("Missing required environment variable: " + name);
    }
    return value;
}

function getFirstDetailValue(event: OhipCheckinEvent, candidates: string[]): string | null {
    if (!Array.isArray(event.detail)) return null;

    const normalized = candidates.map((c) => c.toUpperCase());
    for (const entry of event.detail) {
        const key = (entry.dataElement ?? "").toUpperCase();
        const value = entry.newValue?.trim();
        if (normalized.includes(key) && value) return value;
    }

    return null;
}

function isEligibleCheckinEvent(event: OhipCheckinEvent): boolean {
    return (
        (event.moduleName ?? "").toUpperCase() === "RESERVATION" && (event.eventName ?? "").toUpperCase() === "CHECK IN"
    );
}

function isValidIsoDate(value: string): boolean {
    const date = new Date(value);
    return !isNaN(date.getTime());
}

function validatePolyEvent(payload: PolyCheckinEvent): void {
    if (!payload.hotelId || payload.hotelId.trim() === "") {
        throw new Error("Transformed payload invalid: hotelId is required.");
    }
    if (!payload.roomId || payload.roomId.trim() === "") {
        throw new Error("Transformed payload invalid: roomId is required.");
    }
    if (!payload.checkInTime || !isValidIsoDate(payload.checkInTime)) {
        throw new Error("Transformed payload invalid: checkInTime must be a valid ISO date-time.");
    }
}

function transformToPolyCheckinEvent(event: OhipCheckinEvent, hotelId: string): PolyCheckinEvent | null {
    if (!isEligibleCheckinEvent(event)) {
        return null;
    }

    const roomId = getFirstDetailValue(event, ["ROOM_NUMBER"]);
    if (!roomId) {
        return null;
    }

    const detailCheckInTime = getFirstDetailValue(event, ["CHECK_IN_TIME", "CHECK_IN_DATETIME", "ARRIVAL_TIME"]);

    const checkInTime =
        detailCheckInTime && isValidIsoDate(detailCheckInTime)
            ? new Date(detailCheckInTime).toISOString()
            : new Date().toISOString();

    const reservationId = event.primaryKey?.trim() || undefined;
    const eventId = event.metadata?.uniqueEventId?.trim() || undefined;

    return {
        hotelId,
        roomId: roomId.trim(),
        checkInTime,
        reservationId,
        eventId,
        source: "OHIP_MIDDLEWARE_MOCK",
    };
}

async function postToPolyWebhook(payload: PolyCheckinEvent): Promise<void> {
    const webhookUrl = getEnv("POLY_WEBHOOK_URL");
    const webhookApiKey = (process.env.POLY_WEBHOOK_API_KEY ?? process.env.POLY_API_KEY ?? "").trim();

    if (!webhookApiKey) {
        throw new Error("Missing required environment variable: POLY_WEBHOOK_API_KEY (or POLY_API_KEY).");
    }

    // TODO add retry logic here...
    const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${webhookApiKey}`,
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const bodyText = await response.text().catch(() => "");
        throw new Error(
            "Poly webhook request failed: HTTP " + response.status + " " + response.statusText + ". Body: " + bodyText,
        );
    }

    const responseText = await response.text().catch(() => "");
    console.log("Poly webhook accepted event.", responseText || "(empty response body)");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main(): Promise<void> {
    const hotelId = (process.env.OHIP_HOTEL_ID ?? process.env.HOTEL_ID ?? "").trim();
    if (!hotelId) {
        throw new Error("Missing required environment variable: OHIP_HOTEL_ID (or HOTEL_ID).");
    }

    const incomingEvent = rawOhipCheckinEvent as OhipCheckinEvent;
    const transformed = transformToPolyCheckinEvent(incomingEvent, hotelId);

    if (!transformed) {
        console.log("Event skipped. Not an eligible check-in event or missing ROOM_NUMBER.", {
            moduleName: incomingEvent.moduleName,
            eventName: incomingEvent.eventName,
            eventId: incomingEvent.metadata?.uniqueEventId,
        });
        return;
    }

    validatePolyEvent(transformed);

    console.log("Sending transformed event to Poly:", transformed);
    await postToPolyWebhook(transformed);
}

main().catch((error) => {
    console.error("OHIP middleware failed:", error);
    process.exitCode = 1;
});
