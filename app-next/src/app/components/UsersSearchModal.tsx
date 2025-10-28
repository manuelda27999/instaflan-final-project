"use client";

import { useEffect, useState, useRef, useTransition } from "react";
import Image from "next/image";
import searchUser from "@/lib/api/searchUser";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  image: string;
}

export default function UsersSearchModal() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [usersList, setUsersList] = useState<boolean>(false);
  const [isSearching, startTransition] = useTransition();
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setUsersList(false);
      }
    };
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleSearchUsers = (event: React.ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value;

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!text) {
      setUsers([]);
      return;
    }

    searchTimeoutRef.current = setTimeout(() => {
      startTransition(() => {
        searchUser(text)
          .then((foundUsers) => setUsers(foundUsers))
          .catch((error: unknown) => {
            const message =
              error instanceof Error ? error.message : String(error);
            alert(message);
          });
      });
    }, 500);
  };

  return (
    <div
      className="flex flex-col items-center justify-center mr-3"
      ref={containerRef}
    >
      <input
        onChange={handleSearchUsers}
        onFocus={() => setUsersList(true)}
        className="h-8 w-40 rounded-3xl pl-2 border-2 border-color2 focus:border-black bg-white"
        type="text"
        placeholder="search..."
      />

      {usersList && (
        <div className="absolute top-14 flex flex-col items-center mr-2">
          <div className="modal-peak"></div>
          {isSearching ? (
            <div className="bg-white flex flex-col items-center justify-center rounded-xl px-4 py-2">
              <p className="font-semibold text-color1 text-base">Searching...</p>
            </div>
          ) : users?.length > 0 ? (
            <div className="bg-white flex flex-col items-center justify-center rounded-xl">
              {users?.map((user) => (
                <article className="px-2 py-1" key={user.id}>
                  <div className="flex items-center">
                    <Image
                      unoptimized
                      width={48}
                      height={48}
                      className="rounded-full mr-1 w-12 h-12 object-cover"
                      src={user.image}
                      alt={user.name}
                    />
                    <Link
                      href={`/profile/${user.id}/posts`}
                      className="font-semibold text-color1 text-lg cursor-pointer"
                    >
                      {user.name}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="bg-white flex flex-col items-center justify-center rounded-xl">
              <article className="px-2 py-1">
                <h2 className="font-semibold text-color1 text-lg">Not found</h2>
              </article>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
