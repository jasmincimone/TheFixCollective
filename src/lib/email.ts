import { Resend } from "resend";

function appOrigin(): string {
  const u = process.env.NEXTAUTH_URL || "http://localhost:3000";
  return u.replace(/\/$/, "");
}

export async function sendPasswordResetEmail(to: string, rawToken: string): Promise<{ ok: boolean; error?: string }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[email] RESEND_API_KEY missing; password reset link:", `${appOrigin()}/reset-password?token=${rawToken}`);
    }
    return { ok: false, error: "Email is not configured." };
  }
  const from = process.env.EMAIL_FROM;
  if (!from) {
    return { ok: false, error: "EMAIL_FROM is not set." };
  }
  const url = `${appOrigin()}/reset-password?token=${encodeURIComponent(rawToken)}`;
  const resend = new Resend(key);
  const { error } = await resend.emails.send({
    from,
    to: [to],
    subject: "Reset your password",
    html: `<p>We received a request to reset your password.</p><p><a href="${url}">Reset password</a></p><p>If you didn’t ask for this, you can ignore this email.</p>`,
  });
  if (error) {
    console.error("[email] Resend error:", error);
    return { ok: false, error: "Could not send email." };
  }
  return { ok: true };
}

export async function sendLoginOtpEmail(to: string, code: string): Promise<{ ok: boolean; error?: string }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[email] RESEND_API_KEY missing; login OTP for", to, ":", code);
    }
    return { ok: false, error: "Email is not configured." };
  }
  const from = process.env.EMAIL_FROM;
  if (!from) {
    return { ok: false, error: "EMAIL_FROM is not set." };
  }
  const resend = new Resend(key);
  const { error } = await resend.emails.send({
    from,
    to: [to],
    subject: "Your sign-in code",
    html: `<p>Your sign-in code is <strong>${code}</strong>.</p><p>It expires in 10 minutes.</p>`,
  });
  if (error) {
    console.error("[email] Resend error:", error);
    return { ok: false, error: "Could not send email." };
  }
  return { ok: true };
}
