"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import cookiesToken from "@/lib/helpers/cookiesToken";
import { useModal } from "@/context/ModalContext";

import Header from "../components/Header";
import NavBar from "../components/NavBar";

import CreatePostModal from "@/app/components/modals/CreatePostModal";
import CreateCommentModal from "../components/modals/CreateCommentModal";
import DeletePostModal from "../components/modals/DeletePostModal";
import EditPostModal from "../components/modals/EditPostModal";
import EditUserModal from "../components/modals/EditUserModal";
import FollowedModal from "../components/modals/FollowedModal";
import FollowingModal from "../components/modals/FollowingModal";
import EditDeleteMessageModal from "../components/modals/EditDeleteMessageModal";

interface Post {
  id: string;
  image: string;
  text: string;
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const { modal, closeModal, modalProps } = useModal();

  useEffect(() => {
    const token = cookiesToken.exist();

    if (!token) router.push("/login");
  }, []);

  return (
    <div className="w-full h-full">
      <Header />

      <main className="pt-16 pb-16">{children}</main>

      <NavBar />

      {modal === "create-comment-modal" && (
        <CreateCommentModal
          postId={modalProps?.postId}
          onCreateComment={() => {
            modalProps?.callback?.(closeModal);
          }}
          onHideCreateComment={() => closeModal()}
        />
      )}
      {modal === "create-post-modal" && (
        <CreatePostModal
          onCreatePost={() => {
            modalProps?.callback?.(closeModal);
          }}
          onHideCreatePost={() => closeModal()}
        />
      )}
      {modal === "delete-post-modal" && (
        <DeletePostModal
          postId={modalProps.postId}
          onDeletePost={() => {
            modalProps?.callback?.(closeModal);
          }}
          onHideDeletePost={() => closeModal()}
        />
      )}
      {modal === "edit-delete-message" && (
        <EditDeleteMessageModal
          message={modalProps.message}
          onHideEditDeletePost={() => closeModal()}
        />
      )}
      {modal === "edit-post-modal" && (
        <EditPostModal
          postId={modalProps.postId}
          onEditPost={(post: Post) => {
            modalProps?.callback?.(closeModal, post);
          }}
          onHideEditPost={() => closeModal()}
        />
      )}
      {modal === "edit-user-modal" && (
        <EditUserModal
          user={modalProps.user}
          onEditUser={() => {
            modalProps?.callback?.(closeModal);
          }}
          onHideEditUser={() => closeModal()}
        />
      )}
      {modal === "followed-modal" && (
        <FollowedModal onHideFollowedModal={() => closeModal()} />
      )}
      {modal === "following-modal" && (
        <FollowingModal onHideFollowingModal={() => closeModal()} />
      )}
    </div>
  );
}
