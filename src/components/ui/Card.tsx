import { cn } from "@/lib/cn";

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-fix-border/15 bg-fix-surface shadow-soft",
        className
      )}
      {...props}
    />
  );
}
