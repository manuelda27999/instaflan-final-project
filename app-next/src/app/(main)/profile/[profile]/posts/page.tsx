"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import cookiesToken from "@/lib/helpers/cookiesToken";
import extractUserIdFromToken from "@/lib/helpers/extractUserIdFromToken";
import retrievePostsOfUser from "@/lib/api/retrievePostsOfUser";
import toggleFavPost from "@/lib/api/toggleFavPost";

import EditPostModal from "@/app/components/modals/EditPostModal";
import DeletePostModal from "@/app/components/modals/DeletePostModal";
import CreateCommentModal from "@/app/components/modals/CreateCommentModal";

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

export default function ProfilePosts() {
  const token = cookiesToken.get();
  const userId = extractUserIdFromToken(token);
  const pathname = usePathname();
  const userIdProfile = pathname.split("/")[2];

  const [modal, setModal] = useState<string | null>(null);

  const [posts, setPosts] = useState<Post[]>([]);

  const [postId, setPostId] = useState<string | null>(null);

  useEffect(() => {
    try {
      retrievePostsOfUser(token, userIdProfile)
        .then((posts) => {
          setPosts(posts);
        })
        .catch((error) => alert(error.message));
    } catch (error: any) {
      alert(error.message);
    }
  }, [userIdProfile]);

  const handleEditPostModal = (postId: string) => {
    setPostId(postId);
    setModal("edit-post-modal");
  };

  const handleCancelEditPostModal = () => setModal(null);

  const handleEditPost = () => {
    try {
      retrievePostsOfUser(token, userIdProfile)
        .then((posts) => {
          setPosts(posts);
          setModal(null);
          setPostId(null);
        })
        .catch((error) => {
          alert(error.message);
        });
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleDeletePostModal = (postId: string) => {
    setPostId(postId);
    setModal("delete-post-modal");
  };

  const handleCancelDeletePostModal = () => setModal(null);

  const handleDeletePost = () => {
    try {
      retrievePostsOfUser(token, userIdProfile)
        .then((posts) => {
          setPosts(posts);
          setModal(null);
          setPostId(null);
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

  const handleCommentModal = (postId: any) => {
    setPostId(postId);
    setModal("comment-modal");
  };

  const handleCancelCommentModal = () => setModal(null);

  const handleCreateComment = () => {
    try {
      retrievePostsOfUser(token, userIdProfile)
        .then((posts) => {
          setPosts(posts);
          setModal(null);
          setPostId(null);
        })
        .catch((error) => {
          alert(error.message);
        });
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <section className="">
      {posts?.map((post) => (
        <article key={post.id} className="bg-color5 mb-3">
          <div className="flex justify-between items-center">
            <div className="flex justify-start items-center pl-3 py-1">
              <img
                className="w-12 h-12 rounded-full object-cover mr-2"
                src={post.author.image}
                alt={post.author.name}
              />
              <a className="font-semibold text-color1 text-xl">
                {post.author.name}
              </a>
            </div>
            <button
              onClick={() => handletoggleFavPost(post.id)}
              className="bg-color4 w-10 h-9 text-white border-none rounded-xl px-2 py-1 mr-3 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3"
            >
              {post.fav ? "🤍" : "♡"}
            </button>
          </div>
          <img className="w-full" src={post.image} alt={post.text} />
          <p className="m-2 text-color1 font-semibold ml-3">🤍{post.likes}</p>
          <p className="m-2 text-color1 font-semibold ml-3">{post.text}</p>
          {post.comments.length > 0 && (
            <div className="border-x-color5 border-x-8 bg-white p-1">
              {post?.comments.map((comment) => (
                <article className="flex items-start m-1" key={comment.id}>
                  <img
                    className="w-4 h-4 rounded-full object-cover mr-1"
                    src={comment.author.image}
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
              onClick={() => handleCommentModal(post.id)}
              className="button bg-color4 text-white border-none rounded-xl px-3 py-0.5 mt-2 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3"
            >
              Comment
            </button>
            <div className="flex justify-between gap-2">
              {userId === post.author.id && (
                <button
                  onClick={() => handleEditPostModal(post.id)}
                  className="bg-color4 text-white border-none rounded-xl px-3 py-0.5 mt-2 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3"
                >
                  Edit
                </button>
              )}
              {userId === post.author.id && (
                <button
                  onClick={() => handleDeletePostModal(post.id)}
                  className="button bg-color4 text-white border-none rounded-xl px-3 mt-2 py-0.5 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </article>
      ))}

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
    </section>
  );
}
