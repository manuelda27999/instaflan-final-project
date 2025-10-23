"use client";

import { useEffect, useState } from "react";
import cookiesToken from "@/lib/helpers/cookiesToken";
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
  const token = cookiesToken.get();

  const { openModal } = useModal();

  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (token) {
      try {
        retrievePosts(token)
          .then((posts) => {
            setPosts(posts);
          })
          .catch((error: unknown) => {
            const message =
              error instanceof Error ? error.message : String(error);
            alert(message);
          });
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        alert(message);
      }
    }
  }, [posts.length, token]);

  const updatePosts = () => {
    if (!token) return;
    try {
      retrievePosts(token)
        .then((posts) => {
          setPosts(posts);
        })
        .catch((error) => {
          alert(error.message);
        });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      alert(message);
    }
  };

  function handleToggleFavPost(postId: string) {
    if (token) {
      try {
        toggleFavPost(token, postId)
          .then(() => {
            setPosts((posts) => {
              const posts2 = [...posts];

              const index = posts2.findIndex((post) => post.id === postId);
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
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        alert(message);
      }
    }
  }

  return (
    <section className="pt-2">
      {posts.length === 0 && (
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
    </section>
  );
}
