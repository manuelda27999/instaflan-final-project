"use client";

import Link from "next/link";
import cookiesToken from "@/lib/helpers/cookiesToken";
import extractUserIdFromToken from "@/lib/helpers/extractUserIdFromToken";

import { useModal } from "@/context/ModalContext";

interface Post {
  id: string;
  fav: boolean;
  likes: number;
  text: string;
  image: string;
  author: {
    id: string;
    name: string;
    image: string;
  };
  comments: Array<{
    id: string;
    text: string;
    author: {
      id: string;
      name: string;
      image: string;
    };
  }>;
}

interface PostProps {
  post: Post;
  updatePosts: () => void;
  handleToggleFavPostProps: (postId: string) => void;
}

export default function Post(props: PostProps) {
  const token = cookiesToken.get();
  let userId: string | null = null;

  if (token) {
    userId = extractUserIdFromToken(token);
  }

  const { openModal } = useModal();

  return (
    <article key={props.post.id} className="bg-color5 mb-3">
      <div className="flex justify-between items-center">
        <div className="flex justify-start items-center pl-3 py-1">
          <img
            className="w-12 h-12 rounded-full object-cover mr-2"
            src={props.post.author.image}
            alt={props.post.author.name}
          />
          <Link
            href={`/profile/${props.post.author.id}/posts`}
            className="font-semibold text-color1 text-xl cursor-pointer"
          >
            {props.post.author.name}
          </Link>
        </div>
        <button
          onClick={() => props.handleToggleFavPostProps(props.post.id)}
          className="bg-color4 w-10 h-9 text-white border-none rounded-xl px-2 py-1 mr-3 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3"
        >
          {props.post.fav ? "🤍" : "♡"}
        </button>
      </div>
      <img className="w-full" src={props.post.image} alt={props.post.text} />
      <p className="m-2 text-color1 font-semibold ml-3">🤍{props.post.likes}</p>
      <p className="m-2 mb-0 text-color1 font-semibold ml-3">
        {props.post.text}
      </p>
      {props.post.comments.length > 0 && (
        <div className="border-x-color5 border-x-8 bg-white p-1">
          {props.post?.comments.map((comment) => (
            <article className="flex items-start m-1" key={comment.id}>
              <img
                className="w-4 h-4 rounded-full object-cover mr-1"
                src={comment.author.image}
                alt=""
              />
              <Link
                className="text-xs text-color1 font-bold whitespace-nowrap"
                href={`/profile/${props.post.author.id}/posts`}
              >
                {comment.author.name + ":"}
              </Link>
              <p className="text-xs ml-1">{comment.text}</p>
            </article>
          ))}
        </div>
      )}
      <div className="flex justify-between w-full px-4 pb-2">
        <button
          onClick={() =>
            openModal("create-comment-modal", {
              postId: props.post.id,
              callback: (close: () => void) => {
                props.updatePosts();
                close();
              },
            })
          }
          className="button bg-color4 text-white border-none rounded-xl px-3 py-0.5 mt-2 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3"
        >
          Comment
        </button>
        <div className="flex justify-between gap-2">
          {userId === props.post.author.id && (
            <button
              onClick={() =>
                openModal("edit-post-modal", {
                  postId: props.post.id,
                  callback: (close: () => {}) => {
                    props.updatePosts();
                    close();
                  },
                })
              }
              className="bg-color4 text-white border-none rounded-xl px-3 py-0.5 mt-2 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3"
            >
              Edit
            </button>
          )}
          {userId === props.post.author.id && (
            <button
              onClick={() =>
                openModal("delete-post-modal", {
                  postId: props.post.id,
                  callback: (close: () => {}) => {
                    props.updatePosts();
                    close();
                  },
                })
              }
              className="button bg-color4 text-white border-none rounded-xl px-3 mt-2 py-0.5 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
