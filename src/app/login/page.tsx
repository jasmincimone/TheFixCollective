"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { Container } from "@/components/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/account";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", {
      email: email.trim(),
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password.");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <Container className="py-12 sm:py-16">
      <div className="mx-auto max-w-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-fix-heading">Sign in</h1>
        <p className="mt-1 text-sm text-fix-text-muted">
          Access your order history and downloads.
        </p>
        <Card className="mt-6 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-fix-text">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-fix-border/20 bg-fix-surface px-3 py-2 text-fix-text focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
              />
            </div>
            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-fix-text">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-fix-border/20 bg-fix-surface px-3 py-2 text-fix-text focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
              />
            </div>
            {error && <p className="text-sm text-bark">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full" variant="primary">
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-fix-text-muted">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-fix-link hover:text-fix-link-hover">
              Sign up
            </Link>
          </p>
        </Card>
      </div>
    </Container>
  );
}
