"use client";

import { useState, useEffect, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import usePageTitle from "@/lib/hooks/usePageTittle";
import UsersSearchModal from "@/app/components/UsersSearchModal";
import { deleteSession } from "@/lib/helpers/session";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const [page, setPage] = useState("Instaflan");
  const pageTitle = usePageTitle(pathname);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setPage(pageTitle);
  }, [pathname, pageTitle]);

  const handleLogout = () => {
    startTransition(() => {
      deleteSession()
        .then(() => {
          router.push("/login");
        })
        .catch((error: unknown) => {
          const message = error instanceof Error ? error.message : String(error);
          alert(message);
        });
    });
  };

  return (
    <header className="w-full h-16 bg-color5 fixed top-0 left-0 flex justify-between items-center pl-5 pr-3 z-10">
      <div className="flex items-center">
        <h2 className="text-xl text-color1 font-semibold">{page}</h2>
        {page === "Instaflan" && (
          <Image
            unoptimized
            width={64}
            height={64}
            className="w-16"
            src="/images/flan.png"
            alt="Icon flan"
          />
        )}
      </div>
      {page === "Profile" ? (
        <nav>
          <button
            onClick={handleLogout}
            disabled={isPending}
            className="bg-color4 text-white border-none rounded-xl px-3 py-1 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3"
          >
            {isPending ? "Logging out..." : "Logout"}
          </button>
        </nav>
      ) : (
        <UsersSearchModal />
      )}
    </header>
  );
}
