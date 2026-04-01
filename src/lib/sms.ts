export async function sendSms(toE164: string, body: string): Promise<{ ok: boolean; error?: string }> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;
  if (!sid || !token || !from) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[sms] Twilio env missing; SMS to", toE164, ":", body);
    }
    return { ok: false, error: "SMS is not configured." };
  }
  const auth = Buffer.from(`${sid}:${token}`).toString("base64");
  const params = new URLSearchParams({ To: toE164, From: from, Body: body });
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });
  if (!res.ok) {
    const t = await res.text();
    console.error("[sms] Twilio error:", res.status, t);
    return { ok: false, error: "Could not send SMS." };
  }
  return { ok: true };
}
