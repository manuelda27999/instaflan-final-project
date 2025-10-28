"use client";

import { useTransition } from "react";
import createComment from "@/lib/api/createComment";

interface CreateCommentModalProps {
  postId: string;
  onCreateComment: () => void;
  onHideCreateComment: () => void;
}

export default function CreateCommentModal(props: CreateCommentModalProps) {
  const [isPending, startTransition] = useTransition();

  const handleSubmitComment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const text = (form.elements.namedItem("text") as HTMLInputElement).value;

    startTransition(() => {
      createComment(props.postId, text)
        .then(() => {
          props.onCreateComment();
        })
        .catch((error: unknown) => {
          const message =
            error instanceof Error ? error.message : String(error);
          alert(message);
        });
    });
  };

  const handleCancelCreateComment = () => props.onHideCreateComment();

  return (
    <div className="fixed z-30 top-0 left-0 right-0 bottom-0 m-auto bg-black/50 w-full h-full flex flex-col items-center justify-center">
      <form
        onSubmit={handleSubmitComment}
        className="flex flex-col justify-center items-center p-6 bg-color5 border-solid border-black border-4 rounded-lg w-64"
        action=""
      >
        <h3 className="font-bold text-xl text-color1 mb-4">Comment post</h3>
        <p className="m-1 text-color1 font-semibold">Text</p>
        <textarea
          className="p-1 rounded-xl border-color2 border-2"
          id="text"
          name=""
          cols={25}
          rows={3}
        ></textarea>
        <div className="flex justify-around mt-5 w-full">
          <button
            type="submit"
            disabled={isPending}
            className="bg-color4 text-white border-none rounded-xl px-3 py-1 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3"
          >
            {isPending ? "Creating..." : "Create"}
          </button>
          <button
            onClick={handleCancelCreateComment}
            type="button"
            className="bg-color4 text-white border-none rounded-xl px-3 py-1 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
