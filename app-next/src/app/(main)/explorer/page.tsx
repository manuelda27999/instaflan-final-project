"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import cookiesToken from "@/lib/helpers/cookiesToken";
import retrieveUsersNotFollowed from "@/lib/api/retrieveUsersNotFollowed";
import retrievePostsNotFollowed from "@/lib/api/retrievePostsNotFollowed";
import toggleFollowUser from "@/lib/api/toggleFollowUser";
import toggleFavPost from "@/lib/api/toggleFavPost";
import Post from "@/app/components/Post";

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

  const token = cookiesToken.get();

  useEffect(() => {
    try {
      Promise.all([
        retrieveUsersNotFollowed(token),
        retrievePostsNotFollowed(token),
      ])
        .then(([users, posts]) => {
          setUsers(users);
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
  }, [token]);

  function handleFollowUser(userIdProfile: string) {
    try {
      toggleFollowUser(token, userIdProfile)
        .then(() => {
          setUsers((users) => {
            const users2 = [...users];

            const index = users2.findIndex((user) => user.id === userIdProfile);

            users2.splice(index, 1);

            return users2;
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

  function handleUpdateUsers() {
    try {
      retrieveUsersNotFollowed(token)
        .then((users) => {
          setUsers(users);
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

  function handleUpdatePosts() {
    try {
      retrievePostsNotFollowed(token)
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
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      alert(message);
    }
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
              <Image
                unoptimized
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover mr-2"
                src={user.image || "/images/default-profile.webp"}
                alt={user.name}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/images/default-profile.webp";
                }}
              />
              <Link
                href={`profile/${user.id}/posts`}
                className="font-semibold text-color1 text-xl"
              >
                {user.name}
              </Link>
            </div>
            <button
              onClick={() => handleFollowUser(user.id)}
              className="button bg-color4 text-white border-none rounded-xl px-3 py-1 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3 edit-profile-button"
            >
              Follow
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
          className="bg-color4 text-white border-none rounded-xl px-3 py-1 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3"
        >
          Update posts
        </button>
      </article>
    </section>
  );
}
