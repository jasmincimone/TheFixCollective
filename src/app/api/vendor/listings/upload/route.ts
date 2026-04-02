import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { ROLES, VENDOR_STATUS } from "@/lib/roles";

/** App Router: ensure fs and Node APIs are available (not Edge). */
export const runtime = "nodejs";

const MAX_BYTES = 5 * 1024 * 1024;

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/x-png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

function isBlobLike(v: unknown): v is Blob {
  return (
    typeof v === "object" &&
    v !== null &&
    typeof (v as Blob).arrayBuffer === "function" &&
    typeof (v as Blob).size === "number"
  );
}

function extFromFilename(name: string): string | null {
  const m = name.toLowerCase().match(/\.(jpe?g|png|webp|gif)$/i);
  if (!m) return null;
  const ext = m[1].toLowerCase();
  if (ext === "jpeg" || ext === "jpg") return ".jpg";
  if (ext === "png") return ".png";
  if (ext === "webp") return ".webp";
  if (ext === "gif") return ".gif";
  return null;
}

function resolveExt(mimeType: string, fileName: string): { ext: string } | { error: string } {
  const normalized = mimeType.trim().toLowerCase();
  if (normalized && MIME_TO_EXT[normalized]) {
    return { ext: MIME_TO_EXT[normalized] };
  }
  const fromName = extFromFilename(fileName);
  if (fromName) {
    return { ext: fromName };
  }
  if (!normalized) {
    return {
      error:
        "Could not detect image type (empty MIME). Rename the file to end in .png, .jpg, .webp, or .gif, or try another browser.",
    };
  }
  return {
    error: `Unsupported type "${mimeType}". Use JPEG, PNG, WebP, or GIF.`,
  };
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: "You are not signed in.",
          hint: "Sign in and try again.",
          code: "UNAUTHORIZED",
        },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { vendorProfile: true },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "Account not found.",
          code: "NO_USER",
        },
        { status: 403 }
      );
    }

    const isAdminUser = user.role === ROLES.ADMIN;

    if (!isAdminUser) {
      if (!user.vendorProfile) {
        return NextResponse.json(
          {
            error: "No vendor profile on this account.",
            hint: "Complete the vendor application from your account dashboard first.",
            code: "NO_VENDOR_PROFILE",
          },
          { status: 403 }
        );
      }

      if (user.vendorProfile.status !== VENDOR_STATUS.APPROVED) {
        return NextResponse.json(
          {
            error: `Vendor status is "${user.vendorProfile.status}", not approved yet.`,
            hint: "Wait for an admin to approve your vendor application, then try again.",
            code: "VENDOR_NOT_APPROVED",
            details: { vendorStatus: user.vendorProfile.status },
          },
          { status: 403 }
        );
      }
    }

    const canUpload =
      user.role === ROLES.VENDOR ||
      user.role === ROLES.ADMIN;
    if (!canUpload) {
      return NextResponse.json(
        {
          error: `Your account role is "${user.role}". Listing image uploads require Vendor or Admin.`,
          hint: "Ask an admin to set your role to Vendor in Admin → Users.",
          code: "WRONG_ROLE",
          details: { role: user.role },
        },
        { status: 403 }
      );
    }

    let formData: FormData;
    try {
      formData = await request.formData();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      return NextResponse.json(
        {
          error: "Could not read upload form data.",
          hint: "Try a smaller file or another browser.",
          code: "FORM_DATA_PARSE",
          details: process.env.NODE_ENV === "development" ? { message: msg } : undefined,
        },
        { status: 400 }
      );
    }

    const entry = formData.get("file");
    if (entry == null) {
      return NextResponse.json(
        {
          error: "No file was sent.",
          hint: 'The form must include a field named "file".',
          code: "MISSING_FILE",
        },
        { status: 400 }
      );
    }

    if (typeof entry === "string") {
      return NextResponse.json(
        {
          error: "Invalid file payload.",
          hint: "Choose an image file from your device.",
          code: "INVALID_FILE_ENTRY",
        },
        { status: 400 }
      );
    }

    if (!isBlobLike(entry)) {
      return NextResponse.json(
        {
          error: "Invalid file payload.",
          hint: "The server did not receive a readable file blob.",
          code: "NOT_A_BLOB",
          details: { constructor: (entry as object)?.constructor?.name ?? "unknown" },
        },
        { status: 400 }
      );
    }

    const blob = entry;
    const fileName =
      typeof File !== "undefined" && blob instanceof File ? blob.name : "upload.bin";
    const mimeType = blob.type || "";

    if (blob.size === 0) {
      return NextResponse.json(
        {
          error: "The selected file is empty (0 bytes).",
          hint: "Pick a different image file.",
          code: "EMPTY_FILE",
        },
        { status: 400 }
      );
    }

    if (blob.size > MAX_BYTES) {
      const mb = (blob.size / (1024 * 1024)).toFixed(2);
      return NextResponse.json(
        {
          error: `File is too large (${mb} MB). Maximum is 5 MB.`,
          hint: "Resize or compress the image, or paste an image URL instead.",
          code: "FILE_TOO_LARGE",
          details: { sizeBytes: blob.size, maxBytes: MAX_BYTES },
        },
        { status: 400 }
      );
    }

    const resolved = resolveExt(mimeType, fileName);
    if ("error" in resolved) {
      return NextResponse.json(
        {
          error: resolved.error,
          hint: "Use JPEG, PNG, WebP, or GIF.",
          code: "BAD_MIME",
          details: { reportedType: mimeType || null, name: fileName },
        },
        { status: 400 }
      );
    }
    const { ext } = resolved;

    const buffer = Buffer.from(await blob.arrayBuffer());
    const filename = `${crypto.randomUUID()}${ext}`;

    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
    if (blobToken) {
      const contentType =
        mimeType.trim() ||
        (ext === ".jpg"
          ? "image/jpeg"
          : ext === ".png"
            ? "image/png"
            : ext === ".webp"
              ? "image/webp"
              : "image/gif");
      const uploaded = await put(`vendor-listings/${filename}`, buffer, {
        access: "public",
        contentType,
        token: blobToken,
      });
      return NextResponse.json({ url: uploaded.url });
    }

    if (process.env.VERCEL) {
      return NextResponse.json(
        {
          error: "Image upload is not configured on this server.",
          hint:
            "Vercel cannot save files to disk. In Vercel: Storage → Blob → create a store and connect it to this project (adds BLOB_READ_WRITE_TOKEN), then redeploy. Or paste a full https:// image URL in the Image address field.",
          code: "BLOB_NOT_CONFIGURED",
        },
        { status: 503 }
      );
    }

    const dir = path.join(process.cwd(), "public", "uploads", "vendor-listings");
    await mkdir(dir, { recursive: true });
    const fullPath = path.join(dir, filename);
    await writeFile(fullPath, buffer);
    const publicUrl = `/uploads/vendor-listings/${filename}`;
    return NextResponse.json({ url: publicUrl });
  } catch (e) {
    const err = e as NodeJS.ErrnoException;
    const code = err?.code;
    const message = e instanceof Error ? e.message : String(e);
    const stack = e instanceof Error ? e.stack : undefined;
    console.error("[vendor listing upload] error:", e);

    if (code === "EACCES" || code === "EPERM" || code === "ENOSPC" || message.includes("EACCES")) {
      return NextResponse.json(
        {
          error: "Failed to save image on the server (filesystem).",
          hint:
            code === "ENOSPC"
              ? "Disk may be full."
              : "Permission denied writing under public/uploads. Check folder permissions.",
          code: "WRITE_FAILED",
          details: process.env.NODE_ENV === "development" ? { errno: code, message } : { errno: code },
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: "Unexpected error while handling upload.",
        hint: "Check the terminal running `next dev` for the full stack trace.",
        code: "UNHANDLED",
        details:
          process.env.NODE_ENV === "development"
            ? { message, stack, errno: code }
            : { message: "Enable NODE_ENV=development for more detail." },
      },
      { status: 500 }
    );
  }
}
