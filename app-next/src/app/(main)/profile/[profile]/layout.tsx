"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

import cookiesToken from "@/lib/helpers/cookiesToken";
import extractUserIdFromToken from "@/lib/helpers/extractUserIdFromToken";
import retrieveUserById from "@/lib/api/retrieveUserById";
import toggleFollowUser from "@/lib/api/toggleFollowUser";
import createChat from "@/lib/api/createChat";
import EditUserModal from "@/app/components/modals/EditUserModal";
import FollowingModal from "@/app/components/modals/FollowingModal";
import FollowedModal from "@/app/components/modals/FollowedModal";

interface User {
  id: string;
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

  const [modal, setModal] = useState<string | null>(null);

  const [userProfile, setUserProfile] = useState<User | null>(null);

  useEffect(() => {
    try {
      retrieveUserById(token, userIdProfile)
        .then((userProfile) => {
          setUserProfile(userProfile);
        })
        .catch((error) => alert(error.message));
    } catch (error: any) {
      alert(error.message);
    }
  }, [userIdProfile]);

  const handleEditUserModal = () => setModal("edit-user-modal");
  const handleCancelModal = () => {
    try {
      retrieveUserById(token, userIdProfile)
        .then((user) => {
          setModal(null);
          setUserProfile(user);
        })
        .catch((error) => {
          alert(error.message);
        });
    } catch (error: any) {
      alert(error.message);
    }
  };
  const handleEditUser = () => {
    try {
      retrieveUserById(token, userIdProfile)
        .then((user) => {
          setModal(null);

          setUserProfile(user);
        })
        .catch((error) => {
          alert(error.message);
        });
    } catch (error: any) {
      alert(error.message);
    }
  };

  function handleProfilePosts() {
    router.push(`/profile/${userIdProfile}/posts`);
  }

  function handleProfileFavPosts() {
    router.push(`/profile/${userIdProfile}/fav-posts`);
  }

  function handleFollowUser() {
    try {
      toggleFollowUser(token, userIdProfile)
        .then(() => {
          return retrieveUserById(token, userIdProfile);
        })
        .then((userProfile) => setUserProfile(userProfile))
        .catch((error: any) => alert(error.message));
    } catch (error: any) {
      alert(error.message);
    }
  }

  const handleSendMessageModal = () => {
    try {
      createChat(token, userIdProfile)
        .then((chatId) => {
          console.log(chatId);
          return router.push(`/messages/${chatId}`);
        })
        .catch((error) => alert(error.message));
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleFollowingModal = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setModal("following-modal");
  };

  const handleFollowedModal = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setModal("followed-modal");
  };

  return (
    <section className="flex flex-col items-center pb-16">
      <div className="flex w-full justify-between items-center py-2 px-3">
        <div className="flex items-center">
          {!userProfile?.image ? (
            <img
              className="w-12 h-12 rounded-full object-cover mr-2"
              src={
                "https://imgs.search.brave.com/jLOzY9Dtq7uH7I2DkMqETsipUhW25GINawy7rLyCLNY/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1pY29uL3Vz/ZXJfMzE4LTE1OTcx/MS5qcGc_c2l6ZT02/MjYmZXh0PWpwZw"
              }
            />
          ) : (
            <img
              className="w-12 h-12 rounded-full object-cover mr-2"
              src={userProfile?.image}
            />
          )}
          <h3 className="font-semibold text-color1 text-xl">
            {userProfile?.name}
          </h3>
        </div>
        <div className="flex gap-3">
          <div className="flex flex-col items-center">
            <p className="text-color2 font-bold">
              {userProfile?.followed ? userProfile?.followed.length : 0}
            </p>
            <a onClick={handleFollowedModal} className="text-color2 font-bold">
              Followed
            </a>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-color2 font-bold">
              {userProfile?.following ? userProfile?.following.length : 0}
            </p>
            <a onClick={handleFollowingModal} className="text-color2 font-bold">
              Following
            </a>
          </div>
        </div>
      </div>
      <p className="text-color1 w-full font-semibold border-b-2 border-b-gray-400 px-3 py-2 pt-0">
        {userProfile?.description}
      </p>
      {userId === userIdProfile ? (
        <button
          onClick={handleEditUserModal}
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
          onClick={() => handleProfilePosts()}
          className="button bg-color4 text-white border-none rounded-xl px-3 py-1 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3"
        >
          {userId === userIdProfile ? "My posts" : "Profile posts"}
        </button>
        <button
          onClick={() => handleProfileFavPosts()}
          className="button bg-color4 text-white border-none rounded-xl px-3 py-1 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3"
        >
          {userId === userIdProfile
            ? "My favorite posts"
            : "Favorite profile posts"}
        </button>
      </div>

      <main>{children}</main>

      {modal === "edit-user-modal" && (
        <EditUserModal
          onEditUser={handleEditUser}
          onHideEditUser={handleCancelModal}
        />
      )}

      {modal === "following-modal" && (
        <FollowingModal onHideFollowingModal={handleCancelModal} />
      )}
      {modal === "followed-modal" && (
        <FollowedModal onHideFollowedModal={handleCancelModal} />
      )}
    </section>
  );
}
