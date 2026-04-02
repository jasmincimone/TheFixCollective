"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type Props = {
  /** When true, the dialog is shown and the page behind it should not scroll. */
  open: boolean;
  /** Called when the user checks both boxes and clicks Continue. */
  onAccept: () => void;
  /** Called when the user declines or closes without accepting. */
  onDecline: () => void;
  /** Optional title override. */
  title?: string;
};

/**
 * Modal requiring separate opt-in to Terms & Conditions and Privacy Policy before continuing.
 */
export function LegalConsentModal({
  open,
  onAccept,
  onDecline,
  title = "Terms & Privacy",
}: Props) {
  const headingId = useId();
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  useEffect(() => {
    if (!open) {
      setAgreeTerms(false);
      setAgreePrivacy(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDecline();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onDecline]);

  if (!open) return null;

  const canContinue = agreeTerms && agreePrivacy;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={headingId}
    >
      <button
        type="button"
        className="absolute inset-0 bg-bark/60 backdrop-blur-sm"
        aria-label="Close"
        onClick={onDecline}
      />
      <Card className="relative z-[101] w-full max-w-lg border-fix-border/30 p-6 shadow-xl">
        <h2 id={headingId} className="text-lg font-semibold text-fix-heading">
          {title}
        </h2>
        <p className="mt-2 text-sm text-fix-text-muted">
          Before you create an account, please confirm you have read and agree to our legal policies. You can open each
          document in a new tab to review it.
        </p>
        <div className="mt-5 space-y-4">
          <label className="flex cursor-pointer items-start gap-3 text-sm leading-snug text-fix-text">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-fix-border/40 text-amber focus:ring-amber"
            />
            <span>
              I have read and agree to the{" "}
              <Link
                href="/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-fix-link underline hover:text-fix-link-hover"
              >
                Terms &amp; Conditions
              </Link>
              .
            </span>
          </label>
          <label className="flex cursor-pointer items-start gap-3 text-sm leading-snug text-fix-text">
            <input
              type="checkbox"
              checked={agreePrivacy}
              onChange={(e) => setAgreePrivacy(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-fix-border/40 text-amber focus:ring-amber"
            />
            <span>
              I have read and agree to the{" "}
              <Link
                href="/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-fix-link underline hover:text-fix-link-hover"
              >
                Privacy Policy
              </Link>
              .
            </span>
          </label>
        </div>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" className="w-full sm:w-auto" onClick={onDecline}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            className="w-full sm:w-auto"
            disabled={!canContinue}
            onClick={() => {
              if (!canContinue) return;
              onAccept();
            }}
          >
            Continue to sign up
          </Button>
        </div>
      </Card>
    </div>
  );
}
