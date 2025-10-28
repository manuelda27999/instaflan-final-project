"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname } from "next/navigation";
import retrieveFavPosts from "@/lib/api/retrieveFavPosts";
import toggleFavPost from "@/lib/api/toggleFavPost";

import Post from "@/app/components/Post";

interface Post {
  id: string;
  text: string;
  likes: number;
  image: string;
  fav: boolean;
  author: { id: string; name: string; image: string };
  comments: {
    id: string;
    text: string;
    author: { id: string; name: string; image: string };
  }[];
}

export default function ProfileFavPosts() {
  const pathname = usePathname();
  const userIdProfile = pathname.split("/")[2];

  const [posts, setPosts] = useState<Post[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    retrieveFavPosts(userIdProfile)
      .then((posts) => {
        setPosts(posts);
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : String(error);
        alert(message);
      });
  }, [userIdProfile]);

  const updatedPosts = () => {
    retrieveFavPosts(userIdProfile)
      .then((posts) => {
        setPosts(posts);
      })
      .catch((error) => {
        alert(error instanceof Error ? error.message : String(error));
      });
  };

  function handletoggleFavPost(postId: string) {
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
    <section className="">
      {posts?.map((post) => (
        <Post
          key={post.id}
          post={post}
          updatePosts={updatedPosts}
          handleToggleFavPostProps={handletoggleFavPost}
        />
      ))}
      {isPending && posts.length === 0 && (
        <p className="text-center text-slate-500 mt-4">Loading favorite posts…</p>
      )}
    </section>
  );
}
