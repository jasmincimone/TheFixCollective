import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";
import { ConnectDemoDashboard } from "@/components/ConnectDemoDashboard";

export const metadata = {
  title: "Connect Demo",
};

export default async function ConnectDemoPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login?callbackUrl=/account/connect-demo");

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-fix-heading">Stripe Connect demo</h2>
        <p className="mt-1 text-sm text-fix-text-muted">
          Sample onboarding, product management, storefront, direct charges, and subscription flows.
        </p>
      </div>
      <ConnectDemoDashboard />
    </div>
  );
}
