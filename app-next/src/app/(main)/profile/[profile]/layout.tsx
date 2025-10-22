"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

import cookiesToken from "@/lib/helpers/cookiesToken";
import extractUserIdFromToken from "@/lib/helpers/extractUserIdFromToken";
import retrieveUserById from "@/lib/api/retrieveUserById";
import toggleFollowUser from "@/lib/api/toggleFollowUser";
import createChat from "@/lib/api/createChat";
import { useModal } from "@/context/ModalContext";

interface User {
  name: string;
  image: string;
  description: string;
  followed?: string[];
  following?: string[];
  follow?: boolean;
}

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const userIdProfile = pathname.split("/")[2];

  const token = cookiesToken.get();
  const userId = extractUserIdFromToken(token);

  const { openModal } = useModal();

  const [userProfile, setUserProfile] = useState<User | null>(null);

  const updateUser = useCallback(() => {
    try {
      retrieveUserById(token, userIdProfile)
        .then((userProfile) => {
          setUserProfile(userProfile);
        })
        .catch((error: unknown) => {
          const message =
            error instanceof Error ? error.message : String(error);
          alert(message);
        });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      alert(message);
    }
  }, [token, userIdProfile]);

  useEffect(() => {
    updateUser();
  }, [updateUser]);

  function handleFollowUser() {
    try {
      toggleFollowUser(token, userIdProfile)
        .then(() => {
          return retrieveUserById(token, userIdProfile);
        })
        .then((userProfile) => setUserProfile(userProfile))
        .catch((error: unknown) => {
          const message =
            error instanceof Error ? error.message : String(error);
          alert(message);
        });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      alert(message);
    }
  }

  const handleSendMessageModal = () => {
    try {
      createChat(token, userIdProfile)
        .then((chatId) => {
          return router.push(`/messages/${chatId}`);
        })
        .catch((error: unknown) => {
          const message =
            error instanceof Error ? error.message : String(error);
          alert(message);
        });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      alert(message);
    }
  };

  return (
    <section className="flex flex-col items-center">
      <div className="flex w-full justify-between items-center py-2 px-3">
        <div className="flex items-center">
          <Image
            unoptimized
            width={48}
            height={48}
            alt={"Profile image of " + userProfile?.name}
            className="w-12 h-12 rounded-full object-cover mr-2"
            src={
              userProfile?.image
                ? userProfile?.image
                : "/images/default-profile.webp"
            }
          />

          <h3 className="font-semibold text-color1 text-xl">
            {userProfile?.name}
          </h3>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => openModal("followed-modal")}
            className="flex flex-col items-center cursor-pointer"
          >
            <p className="text-color2 font-bold">
              {userProfile?.followed ? userProfile?.followed.length : 0}
            </p>
            <p className="text-color2 font-bold">Followed</p>
          </button>
          <button
            onClick={() => openModal("following-modal")}
            className="flex flex-col items-center cursor-pointer"
          >
            <p className="text-color2 font-bold">
              {userProfile?.following ? userProfile?.following.length : 0}
            </p>
            <p className="text-color2 font-bold">Following</p>
          </button>
        </div>
      </div>
      <p className="text-color1 w-full font-semibold border-b-2 border-b-gray-400 px-3 py-2 pt-0">
        {userProfile?.description}
      </p>
      {userId === userIdProfile ? (
        <button
          onClick={() => {
            if (!userProfile) return;
            openModal("edit-user-modal", {
              user: userProfile,
              callback: (close: () => void) => {
                updateUser();
                close();
              },
            });
          }}
          className="button w-32 bg-color4 text-white border-none rounded-xl m-1 px-3 py-1 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3"
        >
          Edit profile
        </button>
      ) : (
        <div className="flex justify-around items-center gap-2 m-2">
          <button
            onClick={handleFollowUser}
            className="button bg-color4 text-white border-none rounded-xl px-3 py-1 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3 edit-profile-button"
          >
            {userProfile?.follow ? "Unfollow" : "Follow"}
          </button>
          <button
            onClick={handleSendMessageModal}
            className="button bg-color4 text-white border-none rounded-xl px-3 py-1 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3 edit-profile-button"
          >
            Direct
          </button>
        </div>
      )}
      <div className="flex w-full justify-evenly p-2 border-t-2 border-t-gray-400">
        <button
          onClick={() => router.push(`/profile/${userIdProfile}/posts`)}
          className="button bg-color4 text-white border-none rounded-xl px-3 py-1 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3"
        >
          {userId === userIdProfile ? "My posts" : "Profile posts"}
        </button>
        <button
          onClick={() => router.push(`/profile/${userIdProfile}/fav-posts`)}
          className="button bg-color4 text-white border-none rounded-xl px-3 py-1 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3"
        >
          {userId === userIdProfile
            ? "My favorite posts"
            : "Favorite profile posts"}
        </button>
      </div>

      <main>{children}</main>
    </section>
  );
}
