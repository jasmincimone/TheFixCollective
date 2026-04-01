"use client";

import { useState } from "react";
import Link from "next/link";

import { Container } from "@/components/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FormFeedback } from "@/components/ui/FormFeedback";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Request failed.");
        setLoading(false);
        return;
      }
      setSent(true);
    } catch {
      setError("Something went wrong.");
    }
    setLoading(false);
  };

  return (
    <Container className="py-12 sm:py-16">
      <div className="mx-auto max-w-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-fix-heading">Forgot password</h1>
        <p className="mt-1 text-sm text-fix-text-muted">
          We&apos;ll email you a link to reset your password if an account exists for that address.
        </p>
        <Card className="mt-6 p-6">
          {sent ? (
            <FormFeedback success="Submitted. If an account exists for that email, you&apos;ll receive reset instructions shortly. Check your spam folder." />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="forgot-email" className="block text-sm font-medium text-fix-text">
                  Email
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-fix-border/20 bg-fix-surface px-3 py-2 text-fix-text focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
                />
              </div>
              <FormFeedback error={error || null} />
              <Button type="submit" disabled={loading} className="w-full" variant="primary">
                {loading ? "Sending…" : "Send reset link"}
              </Button>
            </form>
          )}
          <p className="mt-4 text-center text-sm text-fix-text-muted">
            <Link href="/login" className="text-fix-link hover:text-fix-link-hover">
              Back to sign in
            </Link>
          </p>
        </Card>
      </div>
    </Container>
  );
}
