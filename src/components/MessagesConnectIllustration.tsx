import { PlatformIllustrationBanner } from "@/components/PlatformIllustrationBanner";

/**
 * Messages inbox banner—community + mobile messaging theme (separate from Community page art).
 */
export function MessagesConnectIllustration({ className }: { className?: string }) {
  return (
    <PlatformIllustrationBanner
      src="/images/platform/messages/community-connect.png"
      alt="Illustration of people connecting on phones near a barn, windmill, and house—community messaging."
      width={1024}
      height={511}
      className={className}
    />
  );
}
