import { cn } from "@/lib/cn";

export type PlatformIllustrationBannerProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
};

/** Shared frame for Community / Messages hero illustrations—same max width and chrome everywhere. */
export function PlatformIllustrationBanner({
  src,
  alt,
  width = 1024,
  height = 511,
  className,
}: PlatformIllustrationBannerProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="overflow-hidden rounded-2xl bg-fix-surface ring-1 ring-fix-border/15 shadow-soft">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="block h-auto w-full object-contain object-center"
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  );
}
