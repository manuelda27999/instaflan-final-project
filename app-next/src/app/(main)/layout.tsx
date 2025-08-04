"use client";

import { useState, useEffect, useRef, use } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAppContext } from "@/context/AppContextProvider";
import CreatePostModal from "@/app/components/modals/CreatePostModal";
import UsersSearchModal from "@/app/components/modals/UsersSearchModal";
import NavBar from "../components/NavBar";
import cookiesToken from "@/lib/api/helpers/cookiesToken";

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

  const { user, setUser } = useAppContext();

  const [page, setPage] = useState("Instaflan");
  const [searchModal, setSearchModal] = useState<string | null>(null);
  const [modal, setModal] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [messagesNotReading, setMessagesNotReading] = useState(0);

  useEffect(() => {
    const firstRouteElement = pathname.split("/")[2];
    switch (firstRouteElement) {
      case "home":
        setPage("Instaflan");
        break;
      case "explorer":
        setPage("Explorer");
        break;
      case "messages":
        setPage("Messages");
        break;
      case "notifications":
        setPage("Notifications");
        break;
      case "profile":
        setPage("Profile");
        break;
      default:
        setPage("Instaflan");
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        !modalRef.current?.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setSearchModal(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [pathname]);

  useEffect(() => {
    const token = cookiesToken.get();

    if (!token) router.push("/login");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
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
          <div className="flex items-center">
            <input
              ref={inputRef}
              onFocus={() => setSearchModal("search-modal")}
              className="h-8 w-40 rounded-3xl pl-2"
              type="text"
              placeholder="search..."
            />
          </div>
        )}
      </header>

      <main className="pt-16 pb-16">{children}</main>

      <NavBar
        user={user}
        handleCreatePostModal={handleCreatePostModal}
        messagesNotReading={messagesNotReading}
      />

      {modal === "create-post-modal" && (
        <CreatePostModal
          onCreatePost={() => setModal(null)}
          onHideCreatePost={() => setModal(null)}
        />
      )}
      {searchModal === "search-modal" && (
        <UsersSearchModal users={users} modalRef={modalRef} />
      )}
    </div>
  );
}
