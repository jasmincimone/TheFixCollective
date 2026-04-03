import Image from "next/image";

import { Container } from "@/components/Container";
import { RootSyncChat } from "@/components/RootSyncChat";
import { RootSyncFeatureCards } from "@/components/RootSyncFeatureCards";

export const metadata = {
  title: "RootSync AI",
};

export default function RootSyncPage() {
  return (
    <Container className="py-12 sm:py-16">
      <div className="max-w-3xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
          <Image
            src="/images/platform/rootsync/logo.png"
            alt="RootSync"
            width={72}
            height={72}
            className="h-16 w-16 shrink-0 rounded-full object-cover sm:h-[72px] sm:w-[72px]"
          />
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-fix-heading sm:text-4xl">
              RootSync AI
            </h1>
            <p className="mt-3 text-base text-fix-text-muted">
              Your AI guide for growing, eating well, and planning a resilient
              food business—rooted in farming, gardening, and healthy food.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-md sm:mt-12">
        <Image
          src="/images/platform/rootsync/hero-mark.png"
          alt="RootSync AI illustration: growth, food, and connection"
          width={800}
          height={800}
          className="h-auto w-full rounded-2xl object-contain shadow-soft"
          sizes="(max-width: 768px) 100vw, 28rem"
          priority
        />
      </div>

      <RootSyncFeatureCards />

      <div className="mx-auto w-full max-w-6xl">
        <RootSyncChat />
      </div>
    </Container>
  );
}

