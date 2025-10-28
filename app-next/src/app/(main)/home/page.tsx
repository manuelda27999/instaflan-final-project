"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import retrievePosts from "@/lib/api/retrievePosts";
import Link from "next/link";
import Post from "@/app/components/Post";
import toggleFavPost from "@/lib/api/toggleFavPost";
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

export default function AllPosts() {
  const { openModal } = useModal();

  const [posts, setPosts] = useState<Post[]>([]);
  const [isPending, startTransition] = useTransition();

  const loadPosts = useCallback(() => {
    retrievePosts()
      .then((posts) => {
        setPosts(posts);
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : String(error);
        alert(message);
      });
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const updatePosts = useCallback(() => {
    loadPosts();
  }, [loadPosts]);

  function handleToggleFavPost(postId: string) {
    startTransition(() => {
      toggleFavPost(postId)
        .then(() => {
          setPosts((posts) => {
            const posts2 = [...posts];

            const index = posts2.findIndex((post) => post.id === postId);
            if (index === -1) return posts;

            const post = posts2[index];
            const post2 = { ...post };

            if (post2.fav) {
              post2.likes--;
            } else {
              post2.likes++;
            }

            post2.fav = !post2.fav;

            posts2[index] = post2;

            return posts2;
          });
        })
        .catch((error: unknown) => {
          const message =
            error instanceof Error ? error.message : String(error);
          alert(message);
        });
    });
  }

  return (
    <section className="pt-2">
      {posts.length === 0 && !isPending && (
        <h2 className="text-gray-500 mt-6 text-center text-xl font-bold">
          You do not follow anyone,{" "}
          <Link
            className="text-color3 mt-6 text-center text-xl font-bold"
            href="/explorer"
          >
            start exploring!!
          </Link>
        </h2>
      )}
      {posts.length > 0 &&
        posts.map((post) => (
          <Post
            key={post.id}
            post={post}
            updatePosts={updatePosts}
            handleToggleFavPostProps={handleToggleFavPost}
          />
        ))}
      <div className="fixed flex justify-center items-center bottom-18 w-full z-20">
        <button
          onClick={() =>
            openModal("create-post-modal", {
              callback: (close: () => void) => {
                updatePosts();
                close();
              },
            })
          }
          className="bg-color2 text-white p-2 px-4 rounded-3xl font-extrabold text-lg cursor-pointer transition duration-300 hover:bg-color1"
        >
          New Post
        </button>
      </div>
      {isPending && posts.length === 0 && (
        <p className="text-center text-slate-500 mt-6">Loading feed…</p>
      )}
    </section>
  );
}
