"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import CreatePostModal from "@/app/components/modals/CreatePostModal";
import Header from "../components/Header";
import NavBar from "../components/NavBar";
import cookiesToken from "@/lib/helpers/cookiesToken";
import { useModal } from "@/context/ModalContext";
import CreateCommentModal from "../components/modals/CreateCommentModal";
import DeletePostModal from "../components/modals/DeletePostModal";
import EditPostModal from "../components/modals/EditPostModal";

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

      {modal === "create-post-modal" && (
        <CreatePostModal
          onCreatePost={() => {
            modalProps?.callback?.(closeModal);
          }}
          onHideCreatePost={() => closeModal()}
        />
      )}
      {modal === "create-comment-modal" && (
        <CreateCommentModal
          postId={modalProps?.postId}
          onCreateComment={() => {
            modalProps?.callback?.(closeModal);
          }}
          onHideCreateComment={() => closeModal()}
        />
      )}
      {modal === "edit-post-modal" && (
        <EditPostModal
          postId={modalProps.postId}
          onEditPost={() => {
            modalProps?.callback?.(closeModal);
          }}
          onHideEditPost={() => closeModal()}
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
    </div>
  );
}
