"use client";

import { useState } from "react";
import Link from "next/link";
import cookiesToken from "@/lib/helpers/cookiesToken";
import extractUserIdFromToken from "@/lib/helpers/extractUserIdFromToken";
import EditPostModal from "./modals/EditPostModal";
import CreateCommentModal from "./modals/CreateCommentModal";
import DeletePostModal from "./modals/DeletePostModal";

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

  const [modal, setModal] = useState<string | null>(null);
  const [postId, setPostId] = useState<string | null>(null);

  const handleEditPostModal = (postId: string) => {
    setPostId(postId);
    setModal("edit-post-modal");
  };

  const handleCancelEditPostModal = () => setModal(null);

  const handleEditPost = () => {
    setModal(null);
    setPostId(null);

    props.updatePosts();
  };

  const handleCommentModal = (postId: string) => {
    setPostId(postId);
    setModal("comment-modal");
  };

  const handleCancelCommentModal = () => setModal(null);

  const handleCreateComment = () => {
    setModal(null);
    setPostId(null);

    props.updatePosts();
  };

  const handleDeletePostModal = (postId: string) => {
    setPostId(postId);
    setModal("delete-post-modal");
  };

  const handleCancelDeletePostModal = () => setModal(null);

  const handleDeletePost = () => {
    setModal(null);
    setPostId(null);

    props.updatePosts();
  };

  const handletoggleFavPost = () => {};

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
          onClick={() => handleCommentModal(props.post.id)}
          className="button bg-color4 text-white border-none rounded-xl px-3 py-0.5 mt-2 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3"
        >
          Comment
        </button>
        <div className="flex justify-between gap-2">
          {userId === props.post.author.id && (
            <button
              onClick={() => handleEditPostModal(props.post.id)}
              className="bg-color4 text-white border-none rounded-xl px-3 py-0.5 mt-2 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3"
            >
              Edit
            </button>
          )}
          {userId === props.post.author.id && (
            <button
              onClick={() => handleDeletePostModal(props.post.id)}
              className="button bg-color4 text-white border-none rounded-xl px-3 mt-2 py-0.5 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {modal === "delete-post-modal" && (
        <DeletePostModal
          postId={postId ? postId : ""}
          onDeletePost={handleDeletePost}
          onHideDeletePost={handleCancelDeletePostModal}
        />
      )}
      {modal === "edit-post-modal" && (
        <EditPostModal
          postId={postId ? postId : ""}
          onEditPost={handleEditPost}
          onHideEditPost={handleCancelEditPostModal}
        />
      )}
      {modal === "comment-modal" && (
        <CreateCommentModal
          postId={postId ? postId : ""}
          onCreateComment={handleCreateComment}
          onHideCreateComment={handleCancelCommentModal}
        />
      )}
    </article>
  );
}
