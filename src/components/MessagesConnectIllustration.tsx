import { cn } from "@/lib/cn";

/**
 * Messages inbox banner—community + mobile messaging theme (separate from Community page art).
 */
export function MessagesConnectIllustration({ className }: { className?: string }) {
  return (
    <div className={cn("w-full", className)}>
      <div className="overflow-hidden rounded-2xl bg-fix-surface ring-1 ring-fix-border/15 shadow-soft">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/platform/messages/community-connect.png"
          alt="Illustration of people connecting on phones near a barn, windmill, and house—community messaging."
          width={1024}
          height={511}
          className="block h-auto w-full object-contain object-center"
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  );
}
