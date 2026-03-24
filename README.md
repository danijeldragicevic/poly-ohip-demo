# PolyAPI OHIP Middleware Demo

[![Deploy](https://github.com/polyapi/poly-ohip-demo/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/polyapi/poly-ohip-demo/actions/workflows/deploy.yml)
[![Send Test OHIP Event](https://github.com/polyapi/poly-ohip-demo/actions/workflows/send-test-ohip-event.yml/badge.svg)](https://github.com/polyapi/poly-ohip-demo/actions/workflows/send-test-ohip-event.yml)

This project demonstrates an **OHIP middleware integration** built on the [PolyAPI](https://polyapi.io/) platform.

The goal is to normalize incoming OHIP-style check-in events and route them through PolyAPI to a backend server function. That backend currently logs the event and is intended to be extended to call the Zoom API.

## Data flow

```text
OHIP event (raw)
  -> ohipMiddleware job (local/GitHub Action)
  -> normalize payload
  -> POST /webhooks/{slug}/guest-checkin
  -> Poly API key auth (webhook config)
  -> validateGuestCheckinEvent (security function)
  -> trigger: guestCheckinTrigger
  -> processOhipEvents (server function)
  -> backend logic (Zoom API integration - TODO)
```

1. A raw OHIP-style event is loaded from `src/jobs/ohipCheckinEvent.example.json` (or passed programmatically).
2. `src/jobs/ohipMiddleware.ts` checks event eligibility and transforms it into a normalized check-in payload.
3. The middleware sends the normalized payload to the Poly webhook URL.
4. The webhook enforces Poly API key authentication (`requirePolyApiKey: true`).
5. The security function `validateGuestCheckinEvent` validates required fields and timestamp format.
6. The trigger `guestCheckinTrigger` forwards valid events to `processOhipEvents`.
7. `processOhipEvents` receives the event and is the extension point for Zoom API calls.

## Project components

- `src/jobs/ohipMiddleware.ts`: OHIP event normalization + webhook forwarding.
- `src/webhooks/guestCheckinWebhook.ts`: Public webhook contract and security settings.
- `src/serverFunctions/validateGuestCheckinEvent.ts`: Security function for payload validation.
- `src/triggers/guestCheckinTrigger.ts`: Trigger setup/update against Poly API.
- `src/serverFunctions/processOhipEvents.ts`: Backend processor (currently logs, ready for Zoom integration).

## Tech stack

- TypeScript
- PolyAPI SDK
- Vitest
- Husky

## Prerequisites

- Node.js 18+ (Node 20+ recommended)
- npm
- A PolyAPI environment with deployed webhook/functions

## Setup

1. Clone the repository and move into the project:

```bash
git clone https://github.com/polyapi/poly-ohip-demo.git
cd poly-ohip-demo
```

2. Install dependencies:

```bash
npm install
```

3. Create your environment file:

```bash
cp .env.example .env
```

4. Fill in `.env` values:

```bash
POLY_API_KEY_PROD=your_poly_api_key_here
POLY_API_BASE_URL_PROD=https://na1.polyapi.io/
POLY_WEBHOOK_URL=https://your-poly-webhook-url
OHIP_HOTEL_ID=your_hotel_id_here
```

## Available scripts

```bash
npm test               # run all tests
npm run test:watch     # run tests in watch mode
npm run setup:trigger  # create or update guestCheckinTrigger in Poly
npm run ohip:send      # run OHIP middleware and send sample event to webhook
```

## Running the middleware locally

Use this to simulate receiving an OHIP event and forwarding it to your Poly webhook:

```bash
npm run ohip:send
```

By default, this command:

1. Loads `src/jobs/ohipCheckinEvent.example.json`.
2. Extracts fields like room number and check-in metadata.
3. Builds the normalized payload:
   - `hotelId`
   - `roomId`
   - `checkInTime`
   - `reservationId` (optional)
   - `eventId` (optional)
   - `source`
4. Sends it to `POLY_WEBHOOK_URL` using your API key.

## Webhook payload contract

`guestCheckinWebhook` expects JSON with:

```json
{
    "hotelId": "DEVDAN_DOWNTOWN",
    "roomId": "23",
    "checkInTime": "2026-03-24T12:45:00.000Z",
    "reservationId": "2611983",
    "eventId": "6ea1b2-c0de-4567-8910-mock123",
    "source": "OHIP_MIDDLEWARE_MOCK"
}
```

## Manual webhook test

You can test the webhook directly:

```bash
curl -X POST 'https://<your-poly-host>/webhooks/<slug>/guest-checkin' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer <your-poly-api-key>' \
  --body '{
    "hotelId": "DEVDAN_DOWNTOWN",
    "roomId": "23",
    "checkInTime": "2026-03-24T12:45:00.000Z"
}'
```

Expected response:

```json
{
    "message": "Guest check-in event received."
}
```

## Security and validation

- Authentication: enforced at webhook level via Poly API key requirement.
- Validation: enforced by `validateGuestCheckinEvent` security function.
- Minimum required fields: `hotelId`, `roomId`, `checkInTime`.

Invalid payloads fail security validation and are not forwarded to `processOhipEvents`.

## Deployment and automation

- `deploy.yml`:
  - Runs tests on push to `main`.
  - Deploys Poly resources.
  - Executes `npm run setup:trigger` to ensure trigger wiring.
- `send-test-ohip-event.yml`:
  - Manual workflow (`workflow_dispatch`).
  - Runs `npm run ohip:send` with repository secrets.

## Current backend status

`processOhipEvents` currently logs incoming events. This is the place to implement production backend behavior, such as:

- room-to-device lookup
- Zoom API request composition
- call initiation / notification dispatch
- retries, observability, and idempotency

## License

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
