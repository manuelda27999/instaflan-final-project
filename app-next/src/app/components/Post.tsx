"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
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
  const [post, setPost] = useState<Post>(props.post);
  const token = cookiesToken.get();
  let userId: string | null = null;

  if (token) {
    userId = extractUserIdFromToken(token);
  }

  const { openModal } = useModal();

  useEffect(() => {
    setPost(props.post);
  }, [props.post]);

  function updateThisPost(postParam: {
    id: string;
    image: string;
    text: string;
  }) {
    const updatedPost = post;

    updatedPost.image = postParam.image;
    updatedPost.text = postParam.text;

    setPost(updatedPost);
  }

  return (
    <article key={post.id} className="bg-color5 mb-3">
      <div className="flex justify-between items-center">
        <div className="flex justify-start items-center pl-3 py-1">
          <Image
            unoptimized
            width={48}
            height={48}
            className="w-12 h-12 rounded-full object-cover mr-2"
            src={post.author.image || "/images/default-profile.webp"}
            alt={post.author.name}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/images/default-profile.webp";
            }}
          />
          <Link
            href={`/profile/${post.author.id}/posts`}
            className="font-semibold text-color1 text-xl cursor-pointer"
          >
            {post.author.name}
          </Link>
        </div>
        <button
          onClick={() => props.handleToggleFavPostProps(post.id)}
          className="bg-color4 w-10 h-9 text-white border-none rounded-xl px-2 py-1 mr-3 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3"
        >
          {post.fav ? "🤍" : "♡"}
        </button>
      </div>
      <Image
        unoptimized
        width={800}
        height={600}
        className="w-full h-auto object-cover"
        src={post.image || "/images/image-not-available.webp"}
        alt={post.text}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = "/images/image-not-available.webp";
        }}
      />
      <p className="m-2 text-color1 font-semibold ml-3">🤍{post.likes}</p>
      <p className="m-2 mb-0 text-color1 font-semibold ml-3">{post.text}</p>
      {post.comments.length > 0 && (
        <div className="border-x-color5 border-x-8 bg-white p-1">
          {post?.comments.map((comment) => (
            <article className="flex items-start m-1" key={comment.id}>
              <Image
                unoptimized
                width={16}
                height={16}
                className="w-4 h-4 rounded-full object-cover mr-1"
                src={
                  comment.author.image
                    ? comment.author.image
                    : "/default-profile.png"
                }
                alt=""
              />
              <Link
                className="text-xs text-color1 font-bold whitespace-nowrap"
                href={`/profile/${comment.author.id}/posts`}
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
              postId: post.id,
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
          {userId === post.author.id && (
            <button
              onClick={() =>
                openModal("edit-post-modal", {
                  postId: post.id,
                  callback: (
                    close: () => void,
                    post: { id: string; text: string; image: string }
                  ) => {
                    updateThisPost(post);
                    close();
                  },
                })
              }
              className="bg-color4 text-white border-none rounded-xl px-3 py-0.5 mt-2 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3"
            >
              Edit
            </button>
          )}
          {userId === post.author.id && (
            <button
              onClick={() =>
                openModal("delete-post-modal", {
                  postId: post.id,
                  callback: (close: () => void) => {
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
