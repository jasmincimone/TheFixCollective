import { Prisma } from "@prisma/client";

/** Map common Prisma errors to API responses so dev/prod get actionable messages. */
export function responseForPrismaError(e: unknown): { status: number; error: string } | null {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    if (e.code === "P2022") {
      return {
        status: 503,
        error:
          "Database schema is out of date (missing columns). In the project folder run: npx prisma migrate deploy — use the same DATABASE_URL as this app — then restart the dev server.",
      };
    }
    if (e.code === "P2021") {
      return {
        status: 503,
        error:
          "A required database table is missing. Run: npx prisma migrate deploy with your DATABASE_URL, then restart.",
      };
    }
  }
  return null;
}
