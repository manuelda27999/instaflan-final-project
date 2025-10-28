"use client";

import {
  useEffect,
  useState,
  useCallback,
  useTransition,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

import retrieveUserById from "@/lib/api/retrieveUserById";
import retrieveUser from "@/lib/api/retrieveUser";
import toggleFollowUser from "@/lib/api/toggleFollowUser";
import createChat from "@/lib/api/createChat";
import { useModal } from "@/context/ModalContext";

import EditUserModal from "../../../components/modals/EditUserModal";
import FollowedModal from "../../../components/modals/FollowedModal";
import FollowingModal from "../../../components/modals/FollowingModal";

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
  const { modalState, closeModal, openModal } = useModal();

  const userIdProfile = pathname.split("/")[2];

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [isPending, startTransition] = useTransition();

  const updateUser = useCallback(() => {
    retrieveUserById(userIdProfile)
      .then((profile) => {
        setUserProfile(profile);
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : String(error);
        alert(message);
      });
  }, [userIdProfile]);

  useEffect(() => {
    let active = true;

    Promise.all([retrieveUser(), retrieveUserById(userIdProfile)])
      .then(([currentUser, profile]) => {
        if (!active) return;
        setCurrentUserId(currentUser?.id ?? null);
        setUserProfile(profile);
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : String(error);
        alert(message);
      });

    return () => {
      active = false;
    };
  }, [userIdProfile]);

  const handleFollowUser = () => {
    startTransition(() => {
      toggleFollowUser(userIdProfile)
        .then(() => retrieveUserById(userIdProfile))
        .then((profile) => setUserProfile(profile))
        .catch((error: unknown) => {
          const message = error instanceof Error ? error.message : String(error);
          alert(message);
        });
    });
  };

  const handleSendMessageModal = () => {
    startTransition(() => {
      createChat(userIdProfile)
        .then((chatId) => {
          router.push(`/messages/${chatId}`);
        })
        .catch((error: unknown) => {
          const message = error instanceof Error ? error.message : String(error);
          alert(message);
        });
    });
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
      {currentUserId === userIdProfile ? (
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
            disabled={isPending}
            className="button bg-color4 text-white border-none rounded-xl px-3 py-1 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3 edit-profile-button"
          >
            {isPending
              ? "Updating..."
              : userProfile?.follow
              ? "Unfollow"
              : "Follow"}
          </button>
          <button
            onClick={handleSendMessageModal}
            disabled={isPending}
            className="button bg-color4 text-white border-none rounded-xl px-3 py-1 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3 edit-profile-button"
          >
            {isPending ? "Opening..." : "Direct"}
          </button>
        </div>
      )}
      <div className="flex w-full justify-evenly p-2 border-t-2 border-t-gray-400">
        <button
          onClick={() => router.push(`/profile/${userIdProfile}/posts`)}
          className="button bg-color4 text-white border-none rounded-xl px-3 py-1 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3"
        >
          {currentUserId === userIdProfile ? "My posts" : "Profile posts"}
        </button>
        <button
          onClick={() => router.push(`/profile/${userIdProfile}/fav-posts`)}
          className="button bg-color4 text-white border-none rounded-xl px-3 py-1 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3"
        >
          {currentUserId === userIdProfile
            ? "My favorite posts"
            : "Favorite profile posts"}
        </button>
      </div>

      <main>{children}</main>
      {modalState && modalState.name === "edit-user-modal" && (
        <EditUserModal
          user={modalState.props.user}
          onEditUser={() => {
            modalState.props.callback?.(closeModal);
          }}
          onHideEditUser={() => closeModal()}
        />
      )}
      {modalState && modalState.name === "followed-modal" && (
        <FollowedModal onHideFollowedModal={() => closeModal()} />
      )}
      {modalState && modalState.name === "following-modal" && (
        <FollowingModal onHideFollowingModal={() => closeModal()} />
      )}
    </section>
  );
}
