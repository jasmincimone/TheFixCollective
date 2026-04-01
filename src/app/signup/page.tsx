"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Container } from "@/components/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password, name: name.trim() || undefined }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Sign up failed.");
        setLoading(false);
        return;
      }
      router.push("/login");
      router.refresh();
    } catch {
      setError("Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <Container className="py-12 sm:py-16">
      <div className="mx-auto max-w-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-fix-heading">Create account</h1>
        <p className="mt-1 text-sm text-fix-text-muted">
          Create an account to view order history and download digital purchases.
        </p>
        <Card className="mt-6 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="signup-email" className="block text-sm font-medium text-fix-text">
                Email
              </label>
              <input
                id="signup-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-fix-border/20 bg-fix-surface px-3 py-2 text-fix-text focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
              />
            </div>
            <div>
              <label htmlFor="signup-name" className="block text-sm font-medium text-fix-text">
                Name (optional)
              </label>
              <input
                id="signup-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-fix-border/20 bg-fix-surface px-3 py-2 text-fix-text focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
              />
            </div>
            <div>
              <label htmlFor="signup-password" className="block text-sm font-medium text-fix-text">
                Password
              </label>
              <input
                id="signup-password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-fix-border/20 bg-fix-surface px-3 py-2 text-fix-text focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
              />
              <p className="mt-0.5 text-xs text-fix-text-muted">At least 8 characters</p>
            </div>
            {error && <p className="text-sm text-bark">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full" variant="primary">
              {loading ? "Creating account…" : "Create account"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-fix-text-muted">
            Already have an account?{" "}
            <Link href="/login" className="text-fix-link hover:text-fix-link-hover">
              Sign in
            </Link>
          </p>
        </Card>
      </div>
    </Container>
  );
}
