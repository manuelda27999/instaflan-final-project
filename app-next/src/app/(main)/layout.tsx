"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import CreatePostModal from "@/app/components/modals/CreatePostModal";
import Header from "../components/Header";
import NavBar from "../components/NavBar";
import cookiesToken from "@/lib/helpers/cookiesToken";
import { useModal } from "@/context/ModalContext";

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
    </div>
  );
}
