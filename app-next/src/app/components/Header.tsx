"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import usePageTitle from "@/lib/hooks/usePageTittle";
import cookiesToken from "@/lib/helpers/cookiesToken";
import UsersSearchModal from "@/app/components/UsersSearchModal";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const [page, setPage] = useState("Instaflan");

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

  return (
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
  );
}
