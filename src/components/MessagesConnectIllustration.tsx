import { cn } from "@/lib/cn";

/**
 * Shared landscape illustration for the messages inbox (community + mobile messaging theme).
 */
export function MessagesConnectIllustration({ className }: { className?: string }) {
  return (
    <div className={cn("w-full", className)}>
      <div className="overflow-hidden rounded-2xl bg-fix-surface ring-1 ring-fix-border/15 shadow-soft">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/platform/messages/community-connect.png"
          alt="Illustration of people connecting on phones near a barn, windmill, and house—community messaging."
          width={1200}
          height={600}
          className="block h-auto w-full object-contain object-center"
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  );
}
