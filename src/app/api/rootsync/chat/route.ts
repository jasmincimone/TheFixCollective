import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";
import { rootSyncPrismaReady } from "@/lib/ensureRootSyncPrisma";
import { prisma } from "@/lib/prisma";
import { ROOTSYNC_SYSTEM_PROMPT } from "@/lib/rootsyncPrompt";

const MAX_MESSAGES = 24;
const MAX_CONTENT = 8000;

type ChatRole = "user" | "assistant";

type IncomingMessage = { role: string; content: string };

function sanitizeMessages(raw: unknown): { role: ChatRole; content: string }[] | null {
  if (!Array.isArray(raw)) return null;
  const out: { role: ChatRole; content: string }[] = [];
  for (const m of raw) {
    if (!m || typeof m !== "object") return null;
    const role = (m as IncomingMessage).role;
    const content = (m as IncomingMessage).content;
    if (role !== "user" && role !== "assistant") return null;
    if (typeof content !== "string") return null;
    const trimmed = content.trim();
    if (!trimmed) continue;
    if (trimmed.length > MAX_CONTENT) return null;
    out.push({ role, content: trimmed });
  }
  if (out.length > MAX_MESSAGES) return null;
  return out;
}

function deriveTitle(firstUserMessage: string): string {
  const t = firstUserMessage.trim().replace(/\s+/g, " ");
  if (!t) return "New chat";
  if (t.length <= 72) return t;
  return `${t.slice(0, 72)}…`;
}

async function completeChat(
  apiKey: string,
  messages: { role: ChatRole; content: string }[]
): Promise<string> {
  const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";
  const openai = new OpenAI({ apiKey });
  if (typeof openai.chat?.completions?.create !== "function") {
    throw new Error(
      "OpenAI client is incomplete (missing chat.completions). Try reinstalling: npm install openai"
    );
  }
  const completion = await openai.chat.completions.create({
    model,
    messages: [
      { role: "system", content: ROOTSYNC_SYSTEM_PROMPT },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ],
    max_tokens: 2048,
    temperature: 0.7,
  });

  const text = completion.choices[0]?.message?.content?.trim();
  if (!text) {
    throw new Error("No response from the model.");
  }
  return text;
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey?.trim()) {
    return NextResponse.json(
      { error: "RootSync is not configured yet. Add OPENAI_API_KEY to your environment." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const session = await getServerSession(authOptions);

  // Logged-in: persist per conversation (single new user message per request)
  if (session?.user?.id && typeof (body as { message?: unknown }).message === "string") {
    const ready = rootSyncPrismaReady();
    if (!ready.ok) return ready.response;

    const userId = session.user.id;
    const userMessage = (body as { message: string }).message.trim();
    const rawConvId = (body as { conversationId?: unknown }).conversationId;
    const conversationId =
      typeof rawConvId === "string" && rawConvId.trim() !== "" ? rawConvId.trim() : null;

    if (!userMessage) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }
    if (userMessage.length > MAX_CONTENT) {
      return NextResponse.json({ error: "Message too long." }, { status: 400 });
    }

    try {
      let convId: string;
      let priorForModel: { role: ChatRole; content: string }[] = [];

      if (conversationId) {
        const existing = await prisma.rootSyncConversation.findFirst({
          where: { id: conversationId, userId },
          include: {
            messages: { orderBy: { createdAt: "asc" }, select: { role: true, content: true } },
          },
        });
        if (!existing) {
          return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
        }
        convId = existing.id;
        priorForModel = existing.messages.map((m) => ({
          role: m.role as ChatRole,
          content: m.content,
        }));
      } else {
        const created = await prisma.rootSyncConversation.create({
          data: {
            userId,
            title: deriveTitle(userMessage),
          },
        });
        convId = created.id;
      }

      const maxPrior = Math.max(0, MAX_MESSAGES - 1);
      if (priorForModel.length > maxPrior) {
        priorForModel = priorForModel.slice(-maxPrior);
      }
      const messagesForOpenAI: { role: ChatRole; content: string }[] = [
        ...priorForModel,
        { role: "user", content: userMessage },
      ];

      await prisma.rootSyncMessage.create({
        data: {
          conversationId: convId,
          role: "user",
          content: userMessage,
        },
      });

      const assistantText = await completeChat(apiKey, messagesForOpenAI);

      await prisma.rootSyncMessage.create({
        data: {
          conversationId: convId,
          role: "assistant",
          content: assistantText,
        },
      });

      await prisma.rootSyncConversation.update({
        where: { id: convId },
        data: { updatedAt: new Date() },
      });

      return NextResponse.json({
        message: assistantText,
        conversationId: convId,
      });
    } catch (e) {
      console.error("RootSync persist chat error:", e);
      const msg =
        e instanceof Error && e.message
          ? `Assistant error: ${e.message}`
          : "Something went wrong talking to the assistant.";
      return NextResponse.json({ error: msg }, { status: 502 });
    }
  }

  // Guest / not logged in: stateless conversation (full message array)
  const messages = sanitizeMessages((body as { messages?: unknown }).messages);
  if (!messages || messages.length === 0) {
    return NextResponse.json(
      { error: "Send at least one user message, or sign in to save chats." },
      { status: 400 }
    );
  }

  const last = messages[messages.length - 1];
  if (last.role !== "user") {
    return NextResponse.json({ error: "Last message must be from the user." }, { status: 400 });
  }

  try {
    const text = await completeChat(apiKey, messages);
    return NextResponse.json({ message: text });
  } catch (e) {
    console.error("RootSync chat error:", e);
    const msg =
      e instanceof Error && e.message
        ? `Assistant error: ${e.message}`
        : "Something went wrong talking to the assistant.";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
