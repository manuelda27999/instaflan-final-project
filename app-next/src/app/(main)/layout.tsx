"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

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
  const [messagesNotReading, setMessagesNotReading] = useState(0);

  useEffect(() => {
    const token = cookiesToken.exist();

    if (!token) router.push("/login");
  }, []);

  const handleCreatePostModal = () => setModal("create-post-modal");

  return (
    <div className="w-full h-full">
      <Header />

      <main className="pt-16 pb-16">{children}</main>

      <NavBar
        handleCreatePostModal={handleCreatePostModal}
        messagesNotReading={messagesNotReading}
      />

      {modal === "create-post-modal" && (
        <CreatePostModal
          onCreatePost={() => setModal(null)}
          onHideCreatePost={() => setModal(null)}
        />
      )}
    </div>
  );
}
