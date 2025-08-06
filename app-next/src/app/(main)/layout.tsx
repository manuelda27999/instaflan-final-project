"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import CreatePostModal from "@/app/components/modals/CreatePostModal";
import Header from "../components/Header";
import NavBar from "../components/NavBar";
import cookiesToken from "@/lib/helpers/cookiesToken";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [modal, setModal] = useState<string | null>(null);

  useEffect(() => {
    const token = cookiesToken.exist();

    if (!token) router.push("/login");
  }, []);

  const handleShowCreatePostModal = () => setModal("create-post-modal");

  const handlePostCreated = () => {
    setModal(null);

    router.refresh();
  };

  return (
    <div className="w-full h-full">
      <Header />

      <main className="pt-16 pb-16">{children}</main>

      <NavBar handleCreatePostModal={handleShowCreatePostModal} />

      {modal === "create-post-modal" && (
        <CreatePostModal
          onCreatePost={handlePostCreated}
          onHideCreatePost={() => setModal(null)}
        />
      )}
    </div>
  );
}
