import Image from "next/image";

import { Container } from "@/components/Container";
import { PlatformFeaturesExplorer } from "@/components/PlatformFeaturesExplorer";
import { ButtonLink } from "@/components/ui/Button";

export const metadata = {
  title: "RootSync",
};

export default function RootSyncPlatformPage() {
  return (
    <Container className="py-12 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="flex justify-center">
          <Image
            src="/images/platform/rootsync/logo.png"
            alt="RootSync"
            width={280}
            height={280}
            className="h-44 w-44 rounded-full object-cover sm:h-56 sm:w-56"
            priority
          />
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <ButtonLink href="/signup" variant="cta" size="md" className="min-w-[150px] justify-center">
            Sign up
          </ButtonLink>
          <ButtonLink href="/about" variant="secondary" size="md" className="min-w-[150px] justify-center">
            About us
          </ButtonLink>
        </div>

        <div className="mx-auto mt-12 max-w-4xl text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-fix-heading sm:text-4xl">RootSync</h1>
          <p className="mt-3 text-base leading-relaxed text-fix-text-muted">
            Explore every part of the ecosystem. Click a feature icon to see details and jump to that section
            of the platform.
          </p>
        </div>

        <PlatformFeaturesExplorer />
      </div>
    </Container>
  );
}
