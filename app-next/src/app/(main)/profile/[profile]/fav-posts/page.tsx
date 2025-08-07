"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import cookiesToken from "@/lib/helpers/cookiesToken";
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
  const token = cookiesToken.get();
  const pathname = usePathname();
  const userIdProfile = pathname.split("/")[2];

  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    try {
      retrieveFavPosts(token, userIdProfile)
        .then((posts) => {
          setPosts(posts);
        })
        .catch((error) => alert(error.message));
    } catch (error: any) {
      alert(error.message);
    }
  }, [userIdProfile]);

  const updatedPosts = () => {
    try {
      retrieveFavPosts(token, userIdProfile)
        .then((posts) => {
          setPosts(posts);
        })
        .catch((error) => {
          alert(error.message);
        });
    } catch (error: any) {
      alert(error.message);
    }
  };

  function handletoggleFavPost(postId: string) {
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
        .catch((error) => {
          alert(error.message);
        });
    } catch (error: any) {
      alert(error.message);
    }
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
    </section>
  );
}
