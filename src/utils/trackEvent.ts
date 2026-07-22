import api from "../api/axios";

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

export async function trackEvent(
  eventName: string,
  properties: Record<string, unknown> = {},
): Promise<void> {
  try {
    await api.post("/analytics/events", {
      eventName,
      sessionId: getSessionId(),
      properties,
    });
  }
  catch (err) {
    // Tracking must never break the user's actual flow — log and swallow.
    console.warn("[trackEvent] failed to log event:", eventName, err);
  }
}
