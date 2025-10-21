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

  const { modalState, closeModal } = useModal();
  const modal = modalState?.name ?? null;

  useEffect(() => {
    const token = cookiesToken.exist();

    if (!token) router.push("/login");
  }, [router]);

  return (
    <div className="w-full h-full">
      <Header />

      <main className="pt-16 pb-16">{children}</main>

      <NavBar />

      {modalState && modalState.name === "create-comment-modal" && (
        <CreateCommentModal
          postId={modalState.props.postId}
          onCreateComment={() => {
            modalState.props.callback?.(closeModal);
          }}
          onHideCreateComment={() => closeModal()}
        />
      )}
      {modalState && modalState.name === "create-post-modal" && (
        <CreatePostModal
          onCreatePost={() => {
            modalState.props.callback?.(closeModal);
          }}
          onHideCreatePost={() => closeModal()}
        />
      )}
      {modalState && modalState.name === "delete-post-modal" && (
        <DeletePostModal
          postId={modalState.props.postId}
          onDeletePost={() => {
            modalState.props.callback?.(closeModal);
          }}
          onHideDeletePost={() => closeModal()}
        />
      )}
      {modalState && modalState.name === "edit-delete-message" && (
        <EditDeleteMessageModal
          message={modalState.props.message}
          onHideEditDeletePost={() => closeModal()}
        />
      )}
      {modalState && modalState.name === "edit-post-modal" && (
        <EditPostModal
          postId={modalState.props.postId}
          onEditPost={(post: Post) => {
            modalState.props.callback?.(closeModal, post);
          }}
          onHideEditPost={() => closeModal()}
        />
      )}
      {modalState && modalState.name === "edit-user-modal" && (
        <EditUserModal
          user={modalState.props.user}
          onEditUser={() => {
            modalState.props.callback?.(closeModal);
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
