"use client";

import { useTransition } from "react";
import editUser from "@/lib/api/editUser";

interface User {
  name: string;
  image: string;
  description: string;
}

interface EditUserModalProps {
  user: User;
  onEditUser: () => void;
  onHideEditUser: () => void;
}

export default function EditUserModal(props: EditUserModalProps) {
  const user = props.user;
  const [isPending, startTransition] = useTransition();

  const handleSubmitUser = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const image = (form.elements.namedItem("image") as HTMLInputElement).value;
    const description = (
      form.elements.namedItem("description") as HTMLInputElement
    ).value;

    startTransition(() => {
      editUser(name, image, description)
        .then(() => {
          props.onEditUser();
        })
        .catch((error: unknown) => {
          const message =
            error instanceof Error ? error.message : String(error);
        });
    });
  };

  const handleCancelEditUser = () => props.onHideEditUser();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-lg">
      {user && (
        <form
          onSubmit={handleSubmitUser}
          className="w-full max-w-md space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_40px_120px_-60px_rgba(56,189,248,0.8)] backdrop-blur-xl"
        >
          <header className="space-y-2 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-slate-300">
              Personalize your profile
            </p>
            <h3 className="text-2xl font-semibold text-white">Edit profile</h3>
            <p className="text-sm text-slate-300">
              Update your display name, avatar, and bio to reflect your vibe.
            </p>
          </header>

          <div className="space-y-3">
            <label
              htmlFor="name"
              className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-300"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              defaultValue={user.name || ""}
              className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-400 focus:border-emerald-300/50 focus:outline-none focus:ring-4 focus:ring-emerald-300/20"
              placeholder="Your display name"
              required
            />
          </div>

          <div className="space-y-3">
            <label
              htmlFor="image"
              className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-300"
            >
              Avatar URL
            </label>
            <input
              id="image"
              name="image"
              type="url"
              defaultValue={user.image || ""}
              className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-400 focus:border-emerald-300/50 focus:outline-none focus:ring-4 focus:ring-emerald-300/20"
              placeholder="https://your-avatar-link.jpg"
              required
            />
          </div>

          <div className="space-y-3">
            <label
              htmlFor="description"
              className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-300"
            >
              Bio
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              defaultValue={user.description || ""}
              className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-400 focus:border-emerald-300/50 focus:outline-none focus:ring-4 focus:ring-emerald-300/20"
              placeholder="Share your sweetest story…"
              required
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              onClick={handleCancelEditUser}
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
      )}
    </div>
  );
}
