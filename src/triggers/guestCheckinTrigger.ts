import triggerConfig from "./guestCheckinTrigger.config.json";

const POLY_API_BASE_URL_PROD = process.env.POLY_API_BASE_URL_PROD;
const POLY_API_KEY_PROD = process.env.POLY_API_KEY_PROD;

if (!POLY_API_BASE_URL_PROD) throw new Error("Missing required environment variable: POLY_API_BASE_URL_PROD");
if (!POLY_API_KEY_PROD) throw new Error("Missing required environment variable: POLY_API_KEY_PROD");

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
export async function createGuestCheckinTrigger() {
    const webhook = await findWebhook();
    const serverFunction = await findServerFunction();

    const existingTrigger = await findExistingTrigger();
    if (existingTrigger) {
        // PATCH only accepts: name, waitForResponse, enabled, ownerUserId
        const updatedTrigger = await patchJson(`/triggers/${existingTrigger.id}`, {
            name: triggerConfig.name,
            waitForResponse: triggerConfig.waitForResponse,
            enabled: triggerConfig.enabled,
        });
        console.log(`Trigger '${triggerConfig.name}' updated (id: ${updatedTrigger.id}).`);
        return updatedTrigger;
    }

    // POST accepts the full payload including source and destination
    const createdTrigger = await postJson("/triggers", {
        name: triggerConfig.name,
        source: {
            webhookHandleId: webhook.id,
        },
        destination: {
            serverFunctionId: serverFunction.id,
        },
        waitForResponse: triggerConfig.waitForResponse,
        enabled: triggerConfig.enabled,
    });
    console.log(`Trigger '${triggerConfig.name}' created successfully (id: ${createdTrigger.id}).`);
    return createdTrigger;
}

// ---------------------------------------------------------------------------
// HTTP helpers
// ---------------------------------------------------------------------------
//

function buildHeaders() {
    return {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${POLY_API_KEY_PROD}`,
        "x-poly-api-version": "1",
    };
}

async function getJson(path: string) {
    const response = await fetch(`${POLY_API_BASE_URL_PROD}${path}`, {
        headers: buildHeaders(),
    });
    if (!response.ok) {
        throw new Error(`GET ${path} failed: ${response.status} ${response.statusText}`);
    }
    return response.json();
}

async function postJson(path: string, body: object) {
    const response = await fetch(`${POLY_API_BASE_URL_PROD}${path}`, {
        method: "POST",
        headers: buildHeaders(),
        body: JSON.stringify(body),
    });
    if (!response.ok) {
        const text = await response.text();
        throw new Error(`POST ${path} failed: ${response.status} ${response.statusText} — ${text}`);
    }
    return response.json();
}

async function patchJson(path: string, body: object) {
    const response = await fetch(`${POLY_API_BASE_URL_PROD}${path}`, {
        method: "PATCH",
        headers: buildHeaders(),
        body: JSON.stringify(body),
    });
    if (!response.ok) {
        const text = await response.text();
        throw new Error(`PATCH ${path} failed: ${response.status} ${response.statusText} — ${text}`);
    }
    return response.json();
}

// ---------------------------------------------------------------------------
// Lookup helpers
// ---------------------------------------------------------------------------

async function findWebhook() {
    const webhooks = await getJson("/webhooks");
    const webhook = webhooks.find(
        (wh: any) => wh.context === triggerConfig.source.webhookContext && wh.name === triggerConfig.source.webhookName,
    );
    if (!webhook) {
        throw new Error(
            `Webhook '${triggerConfig.source.webhookContext}.${triggerConfig.source.webhookName}' not found. Deploy the webhook first.`,
        );
    }
    return webhook;
}

async function findServerFunction() {
    const serverFunctions = await getJson("/functions/server");
    const serverFunction = serverFunctions.find(
        (sf: any) =>
            sf.context === triggerConfig.destination.serverFunctionContext &&
            sf.name === triggerConfig.destination.serverFunctionName,
    );
    if (!serverFunction) {
        throw new Error(
            `Server function '${triggerConfig.destination.serverFunctionContext}.${triggerConfig.destination.serverFunctionName}' not found. Deploy the server function first.`,
        );
    }
    return serverFunction;
}

async function findExistingTrigger() {
    const triggers = await getJson("/triggers");
    return triggers.find((t: any) => t.name === triggerConfig.name) ?? null;
}
