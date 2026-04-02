function trimEnv(v: string | undefined): string | undefined {
  const t = typeof v === "string" ? v.trim() : "";
  return t.length > 0 ? t : undefined;
}

function twilioConfigured(): boolean {
  const sid = trimEnv(process.env.TWILIO_ACCOUNT_SID);
  const token = trimEnv(process.env.TWILIO_AUTH_TOKEN);
  const from = trimEnv(process.env.TWILIO_FROM_NUMBER);
  const messagingServiceSid = trimEnv(process.env.TWILIO_MESSAGING_SERVICE_SID);
  return Boolean(sid && token && (from || messagingServiceSid));
}

export type SendSmsResult =
  | { ok: true; devBypass: boolean; twilioMessageSid?: string }
  | { ok: false; error: string };

/** True when Account SID + Auth Token + (From number OR Messaging Service SID) are set. */
export function isSmsConfigured(): boolean {
  return twilioConfigured();
}

/**
 * Local dev: allow SMS MFA / phone verify to complete without Twilio so the OTP flow can be tested.
 * Disabled on Vercel (preview/production) so missing Twilio is never silently ignored in the cloud.
 */
function smsDevBypassWithoutTwilio(): boolean {
  return (
    process.env.NODE_ENV === "development" &&
    !process.env.VERCEL &&
    !twilioConfigured()
  );
}

/**
 * True when `sendSms` will either call Twilio or (local dev only) succeed via dev bypass.
 * Use this in APIs before creating OTP challenges so users get a clear error in production.
 */
export function isSmsSendAvailable(): boolean {
  return twilioConfigured() || smsDevBypassWithoutTwilio();
}

function twilioUserFacingError(status: number, payload: string): string {
  try {
    const j = JSON.parse(payload) as { code?: number; message?: string };
    const code = j.code;
    const msg = typeof j.message === "string" ? j.message : "";
    if (code === 21211 || /invalid.*phone/i.test(msg)) {
      return "That phone number is not valid for SMS.";
    }
    if (code === 21608 || /unverified/i.test(msg)) {
      return "Twilio trial accounts can only text verified numbers. Verify this number in Twilio Console or upgrade.";
    }
    if (code === 21610 || /blacklist/i.test(msg)) {
      return "This number cannot receive messages (blocked or opted out).";
    }
    if (status === 401 || status === 403) {
      return "Twilio rejected the request (check Account SID and Auth Token).";
    }
  } catch {
    // ignore JSON parse
  }
  return "Could not send SMS.";
}

export async function sendSms(toE164: string, body: string): Promise<SendSmsResult> {
  const sid = trimEnv(process.env.TWILIO_ACCOUNT_SID);
  const token = trimEnv(process.env.TWILIO_AUTH_TOKEN);
  const from = trimEnv(process.env.TWILIO_FROM_NUMBER);
  const messagingServiceSid = trimEnv(process.env.TWILIO_MESSAGING_SERVICE_SID);

  if (!twilioConfigured()) {
    if (smsDevBypassWithoutTwilio()) {
      console.warn(
        "[sms] Twilio not configured — dev bypass (no text sent). Code/message would be:\n  To:",
        toE164,
        "\n ",
        body,
        "\n  Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_FROM_NUMBER (or TWILIO_MESSAGING_SERVICE_SID) in .env.local to send real SMS."
      );
      return { ok: true, devBypass: true };
    }
    if (process.env.NODE_ENV === "development") {
      console.warn("[sms] Twilio env missing; SMS to", toE164, ":", body);
    }
    return { ok: false, error: "SMS is not configured." };
  }

  const auth = Buffer.from(`${sid}:${token}`).toString("base64");
  const params = new URLSearchParams({ To: toE164, Body: body });
  if (messagingServiceSid) {
    params.set("MessagingServiceSid", messagingServiceSid);
  } else {
    params.set("From", from!);
  }

  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  const rawText = await res.text();

  if (!res.ok) {
    console.error("[sms] Twilio error:", res.status, rawText);
    return { ok: false, error: twilioUserFacingError(res.status, rawText) };
  }

  let twilioMessageSid: string | undefined;
  try {
    const created = JSON.parse(rawText) as {
      sid?: string;
      status?: string;
      error_code?: string | number | null;
      error_message?: string | null;
    };
    twilioMessageSid = typeof created.sid === "string" ? created.sid : undefined;
    if (created.error_code != null && created.error_code !== "" && created.error_code !== 0) {
      console.error("[sms] Twilio message create returned error fields:", rawText);
      return {
        ok: false,
        error: twilioUserFacingError(res.status, rawText),
      };
    }
    if (created.status === "failed") {
      console.error("[sms] Twilio message status failed:", rawText);
      return { ok: false, error: twilioUserFacingError(res.status, rawText) };
    }
    if (twilioMessageSid) {
      console.log(
        "[sms] Twilio accepted message",
        twilioMessageSid,
        "status:",
        created.status ?? "unknown",
        "→ To:",
        toE164,
        "| If delivery fails, open Twilio Console → Monitor → Logs → Messaging and search this SID."
      );
    }
  } catch {
    console.warn("[sms] Twilio OK but body was not JSON; assuming sent.");
  }

  return { ok: true, devBypass: false, twilioMessageSid };
}
