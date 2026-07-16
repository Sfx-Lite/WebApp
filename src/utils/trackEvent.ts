/**
 * Shared tracking utility — import this from anywhere in the app that
 * needs to log a behavioral event (see the Event Taxonomy v1 tracking
 * plan for the full list of events and their required properties).
 *
 * Usage:
 *   trackEvent('signup_completed', { method: 'google' });
 *   trackEvent('kyc_rejected', { reason: 'blurry_document', submissionId });
 */

let sessionId: string | null = null;

function getSessionId(): string {
  if (!sessionId) {
    sessionId = crypto.randomUUID();
  }
  return sessionId;
}

// TODO: replace with the real way this app retrieves the stored JWT once
// auth is implemented — confirm with Kennedy/whoever owns auth context.
function getAuthToken(): string {
  return localStorage.getItem('access_token') ?? '';
}

// TODO: confirm the real API base URL / env var for this once one exists
// (e.g. import.meta.env.VITE_API_URL) — hardcoded for local dev for now.
const API_BASE_URL = 'http://localhost:4000/api/v1';

export async function trackEvent(
  eventName: string,
  properties: Record<string, unknown> = {},
): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify({
        eventName,
        sessionId: getSessionId(),
        properties,
      }),
    });
  } catch (err) {
    // Tracking must never break the user's actual flow — log and swallow.
    console.warn('[trackEvent] failed to log event:', eventName, err);
  }
}