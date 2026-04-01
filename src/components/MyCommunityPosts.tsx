"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FormFeedback } from "@/components/ui/FormFeedback";
import { formatCommunityDate, formatCommunityDateTime } from "@/lib/formatCommunityDate";

export type SerializedCommunityPost = {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  editedAt: string | null;
};

type Props = {
  posts: SerializedCommunityPost[];
};

export function MyCommunityPosts({ posts: initialPosts }: Props) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function startEdit(p: SerializedCommunityPost) {
    setEditingId(p.id);
    setDraft(p.content);
    setError(null);
    setSuccess(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setDraft("");
    setError(null);
    setSuccess(null);
  }

  async function saveEdit(postId: string) {
    const trimmed = draft.trim();
    if (!trimmed || trimmed.length > 8000) {
      setError("Content must be between 1 and 8,000 characters.");
      return;
    }
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`/api/community/posts/${encodeURIComponent(postId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: trimmed }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Could not save.");
        setSaving(false);
        return;
      }
      const post = data.post as {
        id: string;
        content: string;
        createdAt: string;
        updatedAt: string;
        editedAt: string | null;
      };
      setPosts((prev) => {
        const next = prev.map((row) =>
          row.id === post.id
            ? {
                id: post.id,
                content: post.content,
                createdAt: post.createdAt,
                updatedAt: post.updatedAt,
                editedAt: post.editedAt,
              }
            : row
        );
        return [...next].sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      });
      setEditingId(null);
      setDraft("");
      setSuccess("Saved.");
      window.setTimeout(() => setSuccess(null), 5000);
      router.refresh();
    } catch {
      setError("Something went wrong. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(postId: string) {
    if (!window.confirm("Delete this post? This cannot be undone.")) return;
    setDeletingId(postId);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`/api/community/posts/${encodeURIComponent(postId)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(typeof data.error === "string" ? data.error : "Could not delete.");
        setDeletingId(null);
        return;
      }
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      setSuccess("Deleted.");
      window.setTimeout(() => setSuccess(null), 5000);
      if (editingId === postId) cancelEdit();
      router.refresh();
    } catch {
      setError("Something went wrong. Check your connection and try again.");
    } finally {
      setDeletingId(null);
    }
  }

  if (posts.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-sm text-fix-text-muted">
          You haven&apos;t posted in the community yet.{" "}
          <a href="/community" className="font-medium text-fix-link hover:text-fix-link-hover">
            Start a post
          </a>
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <FormFeedback success={success} error={error} />
      <ul className="space-y-4">
        {posts.map((p) => (
          <li key={p.id}>
            <Card className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1 text-xs text-fix-text-muted">
                  <span>Posted {formatCommunityDate(p.createdAt)}</span>
                  {p.editedAt ? (
                    <>
                      <span className="mx-1.5">·</span>
                      <span className="text-fix-text-muted">
                        Edited {formatCommunityDateTime(p.editedAt)}
                      </span>
                    </>
                  ) : null}
                </div>
                {editingId !== p.id ? (
                  <div className="flex shrink-0 gap-2">
                    <Button type="button" variant="secondary" size="sm" onClick={() => startEdit(p)}>
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-bark hover:bg-bark/10"
                      disabled={deletingId === p.id}
                      onClick={() => remove(p.id)}
                    >
                      {deletingId === p.id ? "Deleting…" : "Delete"}
                    </Button>
                  </div>
                ) : null}
              </div>

              {editingId === p.id ? (
                <div className="mt-3 space-y-3">
                  <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    rows={5}
                    maxLength={8000}
                    className="w-full rounded-xl border border-fix-border/20 bg-fix-surface px-3 py-2 text-sm text-fix-text"
                  />
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="cta"
                      size="sm"
                      disabled={saving}
                      onClick={() => saveEdit(p.id)}
                    >
                      {saving ? "Saving…" : "Save"}
                    </Button>
                    <Button type="button" variant="secondary" size="sm" disabled={saving} onClick={cancelEdit}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-fix-text">{p.content}</p>
              )}
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
