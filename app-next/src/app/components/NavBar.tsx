"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import extractUserIdFromToken from "@/lib/helpers/extractUserIdFromToken";
import cookiesToken from "@/lib/helpers/cookiesToken";
import retrieveUser from "@/lib/api/retrieveUser";

interface NavBarProps {
  handleCreatePostModal: () => void;
  messagesNotReading: number;
}

interface User {
  id: string;
  name: string;
  image: string;
}

export default function NavBar({
  handleCreatePostModal,
  messagesNotReading,
}: NavBarProps) {
  const [userIdProfile, setUserIdProfile] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = cookiesToken.get();

    const userId = extractUserIdFromToken(token);

    setUserIdProfile(userId);

    try {
      retrieveUser(token)
        .then((userData) => {
          setUser(userData);
        })
        .catch((error) => alert(error.message));
    } catch (error: any) {
      alert(error.message);
    }
  }, []);

  return (
    <nav className="w-full h-16 bg-color5 fixed bottom-0 left-0 flex justify-around items-center">
      <Link
        className="text-white text-2xl mx-2 no-underline border-b-2 border-transparent transition-transform duration-200 hover:scale-125"
        href="/home"
      >
        🏠
      </Link>
      <Link
        className="text-white text-2xl mx-2 no-underline border-b-2 border-transparent transition-transform duration-200 hover:scale-125"
        href="/explorer"
      >
        🌍
      </Link>
      <button
        onClick={handleCreatePostModal}
        className="text-white text-2xl mx-2 no-underline border-b-2 border-transparent transition-transform duration-200 hover:scale-125"
      >
        ➕
      </button>
      <div className="flex justify-end">
        {messagesNotReading > 0 && (
          <div className="fixed z-10 rounded-full text-sm font-bold text-white bg-red-600 w-4 h-4 text-center flex justify-center items-center mr-1">
            {messagesNotReading}
          </div>
        )}
        <Link
          className="text-white text-2xl mx-2 no-underline border-b-2 border-transparent transition-transform duration-200 hover:scale-125"
          href="/messages"
        >
          ✉️
        </Link>
      </div>
      <Link
        className="text-white text-2xl mx-2 no-underline border-b-2 border-transparent transition-transform duration-200 hover:scale-125"
        href="/notifications"
      >
        ❤️
      </Link>
      <Link
        className="text-white text-2xl mx-2 no-underline border-b-2 border-transparent transition-transform duration-200 hover:scale-125"
        href={`/profile/${userIdProfile}/posts`}
      >
        {user && (
          <img
            className="w-10 h-10 rounded-full mr-2 object-cover mb-px hover:scale-110"
            src={
              user.image
                ? user.image
                : "https://imgs.search.brave.com/jLOzY9Dtq7uH7I2DkMqETsipUhW25GINawy7rLyCLNY/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1pY29uL3Vz/ZXJfMzE4LTE1OTcx/MS5qcGc_c2l6ZT02/MjYmZXh0PWpwZw"
            }
            alt={user.name}
          />
        )}
      </Link>
    </nav>
  );
}
