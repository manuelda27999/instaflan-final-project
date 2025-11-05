"use client";

import { useState, useEffect, useTransition } from "react";
import retrievePost from "@/lib/api/retrievePost";
import editPost from "@/lib/api/editPost";

interface EditPostModalProps {
  postId: string;
  onEditPost: (post: Post) => void;
  onHideEditPost: () => void;
}

interface Post {
  id: string;
  image: string;
  text: string;
}

export default function EditPostModal(props: EditPostModalProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    retrievePost(props.postId)
      .then((post) => setPost(post))
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : String(error);
      });
  }, [props.postId]);

  const handleSubmitPost = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const image = (form.elements.namedItem("image") as HTMLInputElement).value;
    const text = (form.elements.namedItem("text") as HTMLInputElement).value;

    startTransition(() => {
      editPost(props.postId, image, text)
        .then(() => {
          props.onEditPost({ id: props.postId, image, text });
        })
        .catch((error: unknown) => {
          const message =
            error instanceof Error ? error.message : String(error);
        });
    });
  };

  const handleCancelEditPost = () => props.onHideEditPost();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-lg">
      {post ? (
        <form
          onSubmit={handleSubmitPost}
          className="w-full max-w-md space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_40px_120px_-60px_rgba(56,189,248,0.8)] backdrop-blur-xl"
        >
          <header className="space-y-2 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-slate-300">
              Refresh your post
            </p>
            <h3 className="text-2xl font-semibold text-white">
              Edit this share
            </h3>
            <p className="text-sm text-slate-300">
              Update the image or caption to keep your feed on point.
            </p>
          </header>

          <div className="space-y-3">
            <label
              htmlFor="image"
              className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-300"
            >
              Image URL
            </label>
            <input
              id="image"
              name="image"
              type="url"
              defaultValue={post.image || ""}
              className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-400 focus:border-emerald-300/50 focus:outline-none focus:ring-4 focus:ring-emerald-300/20"
              placeholder="https://your-image-link.jpg"
              required
            />
          </div>

          <div className="space-y-3">
            <label
              htmlFor="text"
              className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-300"
            >
              Caption
            </label>
            <textarea
              id="text"
              name="text"
              rows={4}
              defaultValue={post.text || ""}
              className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-400 focus:border-emerald-300/50 focus:outline-none focus:ring-4 focus:ring-emerald-300/20"
              placeholder="Update your message…"
              required
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              onClick={handleCancelEditPost}
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-6 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-100 transition hover:border-emerald-300/40 hover:bg-white/15 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300/30"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-300 via-teal-300 to-sky-300 px-6 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-900 shadow-lg transition hover:shadow-xl hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isPending ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      ) : (
        <div className="flex w-full max-w-sm items-center justify-center rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300 shadow-[0_40px_120px_-60px_rgba(56,189,248,0.6)] backdrop-blur-xl">
          Loading post…
        </div>
      )}
    </div>
  );
}
