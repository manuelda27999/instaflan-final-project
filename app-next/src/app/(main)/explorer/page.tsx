"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";

import retrieveUsersNotFollowed from "@/lib/api/retrieveUsersNotFollowed";
import retrievePostsNotFollowed from "@/lib/api/retrievePostsNotFollowed";
import toggleFollowUser from "@/lib/api/toggleFollowUser";
import toggleFavPost from "@/lib/api/toggleFavPost";
import Post from "@/app/components/Post";
import ProfileImage from "@/app/components/ProfileImage";

interface User {
  id: string;
  name: string;
  image: string;
}

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

export default function Explorer() {
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isPending, startTransition] = useTransition();
  const [isUpdatingPosts, startPostsTransition] = useTransition();

  useEffect(() => {
    Promise.all([retrieveUsersNotFollowed(), retrievePostsNotFollowed()])
      .then(([users, posts]) => {
        setUsers(users);
        setPosts(posts);
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : String(error);
        alert(message);
      });
  }, []);

  function handleFollowUser(userIdProfile: string) {
    startTransition(() => {
      toggleFollowUser(userIdProfile)
        .then(() => {
          setUsers((users) =>
            users.filter((user) => user.id !== userIdProfile)
          );
        })
        .catch((error: unknown) => {
          const message =
            error instanceof Error ? error.message : String(error);
          alert(message);
        });
    });
  }

  function handleUpdateUsers() {
    startTransition(() => {
      retrieveUsersNotFollowed()
        .then((users) => {
          setUsers(users);
        })
        .catch((error: unknown) => {
          const message =
            error instanceof Error ? error.message : String(error);
          alert(message);
        });
    });
  }

  function handleUpdatePosts() {
    startPostsTransition(() => {
      retrievePostsNotFollowed()
        .then((posts) => {
          setPosts(posts);
        })
        .catch((error: unknown) => {
          const message =
            error instanceof Error ? error.message : String(error);
          alert(message);
        });
    });
  }

  function handletoggleFavPost(postId: string) {
    startPostsTransition(() => {
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
    <section className="pt-2 pb-4 flex flex-col items-center">
      <article className="w-full flex flex-col items-center">
        <h2 className="text-color1 font-semibold mb-2">Maybe you know</h2>
        {users?.map((user) => (
          <article
            key={user.id}
            className="flex mb-4 w-80 bg-color5 rounded-full justify-between items-center pr-5 pl-2 pt-1 pb-1"
          >
            <div className="flex items-center">
              <ProfileImage name={user.name} image={user.image} />
              <Link
                href={`profile/${user.id}/posts`}
                className="font-semibold text-color1 text-xl"
              >
                {user.name}
              </Link>
            </div>
            <button
              onClick={() => handleFollowUser(user.id)}
              disabled={isPending}
              className="button bg-color4 text-white border-none rounded-xl px-3 py-1 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3 edit-profile-button"
            >
              {isPending ? "Following..." : "Follow"}
            </button>
          </article>
        ))}
        <button
          onClick={handleUpdateUsers}
          className="bg-color4 text-white border-none rounded-xl px-3 py-1 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3"
        >
          Update users
        </button>
      </article>
      <article className="w-full flex flex-col items-center mt-6">
        <h2 className="text-color1 font-semibold mb-2">
          You might be interested
        </h2>
        {posts?.map((post) => (
          <Post
            key={post.id}
            post={post}
            updatePosts={handleUpdatePosts}
            handleToggleFavPostProps={handletoggleFavPost}
          />
        ))}
        <button
          onClick={handleUpdatePosts}
          disabled={isUpdatingPosts}
          className="bg-color4 text-white border-none rounded-xl px-3 py-1 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3"
        >
          {isUpdatingPosts ? "Updating…" : "Update posts"}
        </button>
      </article>
    </section>
  );
}
