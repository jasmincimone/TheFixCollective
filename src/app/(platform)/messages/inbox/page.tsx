import { Container } from "@/components/Container";
import { VendorMessenger } from "@/components/VendorMessenger";

export const metadata = {
  title: "Messages inbox",
};

function pickWithParam(value: string | string[] | undefined): string | undefined {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (Array.isArray(value) && value[0]?.trim()) return value[0].trim();
  return undefined;
}

export default function MessagesInboxPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const vendorProfileIdFromUrl = pickWithParam(searchParams.with);
  const userIdFromUrl = pickWithParam(searchParams.withUser);

  return (
    <Container className="py-10 sm:py-12">
      <div className="mb-6 max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-fix-heading sm:text-4xl">
          Messages
        </h1>
        <p className="mt-2 text-base text-fix-text-muted">
          Message marketplace vendors, or anyone you connect with through the community. Only people
          who post or reply publicly there can be messaged from the feed—other accounts stay
          private unless you already have a thread.
        </p>
      </div>

      <VendorMessenger
        vendorProfileIdFromUrl={vendorProfileIdFromUrl}
        userIdFromUrl={userIdFromUrl}
      />
    </Container>
  );
}
