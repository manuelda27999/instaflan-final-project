"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

import CreatePostModal from "@/app/components/modals/CreatePostModal";
import UsersSearchModal from "@/app/components/UsersSearchModal";
import NavBar from "../components/NavBar";
import cookiesToken from "@/lib/helpers/cookiesToken";
import usePageTitle from "@/lib/hooks/usePageTittle";

interface User {
  id: string;
  name: string;
  image: string;
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  const [page, setPage] = useState("Instaflan");
  const [modal, setModal] = useState<string | null>(null);
  const [messagesNotReading, setMessagesNotReading] = useState(0);

  useEffect(() => {
    setPage(usePageTitle(pathname));
  }, [pathname]);

  useEffect(() => {
    const token = cookiesToken.exist();

    if (!token) router.push("/login");
  }, []);

  const handleLogout = () => {
    cookiesToken.delete();
    router.push("/login");
  };

  const handleCreatePostModal = () => setModal("create-post-modal");

  return (
    <div className="w-full h-full">
      <header className="w-full h-16 bg-color5 fixed top-0 left-0 flex justify-between items-center pl-5 pr-3 z-50">
        <div className="flex items-center">
          <h2 className="text-xl text-color1 font-semibold">{page}</h2>
          {page === "Instaflan" && (
            <img className="w-16" src="/images/flan.png" alt="Icon flan" />
          )}
        </div>
        {page === "Profile" ? (
          <nav>
            <button
              onClick={handleLogout}
              className="bg-color4 text-white border-none rounded-xl px-3 py-1 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3"
            >
              Logout
            </button>
          </nav>
        ) : (
          <UsersSearchModal />
        )}
      </header>

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
