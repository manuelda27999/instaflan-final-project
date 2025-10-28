"use client";

import { useTransition } from "react";
import deletePost from "@/lib/api/deletePost";

interface DeletePostModalProps {
  postId: string;
  onDeletePost: () => void;
  onHideDeletePost: () => void;
}

export default function DeletePostModal(props: DeletePostModalProps) {
  const [isPending, startTransition] = useTransition();

  const handleSubmitPost = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(() => {
      deletePost(props.postId)
        .then(() => {
          props.onDeletePost();
        })
        .catch((error: unknown) => {
          const message =
            error instanceof Error ? error.message : String(error);
          alert(message);
          props.onHideDeletePost();
        });
    });
  };

  const handleCancelDeletePost = () => props.onHideDeletePost();

  return (
    <div className="fixed z-30 top-0 left-0 right-0 bottom-0 m-auto bg-black/60 w-full h-full z-2 flex flex-col items-center justify-center">
      <form
        onSubmit={handleSubmitPost}
        className="flex flex-col justify-center items-center p-6 bg-color5 border-3 border-solid border-black border-4 rounded-lg w-64"
        action=""
      >
        <h3 className="font-bold text-xl text-color1 mb-4">Delete post</h3>
        <p className="m-1 text-color1 font-semibold">
          Are you sure to delete this post?
        </p>
        <div className="flex justify-around mt-5 w-full">
          <button
            type="submit"
            disabled={isPending}
            className="bg-color4 text-white border-none rounded-xl px-3 py-1 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3"
          >
            {isPending ? "Deleting..." : "Delete"}
          </button>
          <button
            onClick={handleCancelDeletePost}
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
