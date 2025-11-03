"use client";

import { useEffect, useState, useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import deleteNotification from "@/lib/api/deleteNotification";
import deleteAllNotifications from "@/lib/api/deleteAllNotifications";
import retrieveNotifications from "@/lib/api/retrieveNotifications";
import ProfileImage from "@/app/components/ProfileImage";

interface Notification {
  id: string;
  text: string;
  user: {
    id: string;
    name: string;
    image: string;
  };
  post?: {
    image: string;
  };
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const loadNotifications = useCallback(() => {
    retrieveNotifications()
      .then((notifications) => setNotifications(notifications))
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : String(error);
        alert(message);
      });
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const handleProfile = (
    event: React.MouseEvent<HTMLAnchorElement>,
    userIdProfile: string
  ) => {
    event.preventDefault();
    router.push(`/profile/${userIdProfile}/posts`);
  };

  const handleDeleteNotification = (notificationId: string) => {
    startTransition(() => {
      deleteNotification(notificationId)
        .then(() => loadNotifications())
        .catch((error: unknown) => {
          const message =
            error instanceof Error ? error.message : String(error);
          alert(message);
        });
    });
  };

  const handleDeleteAllNotifications = () => {
    startTransition(() => {
      deleteAllNotifications()
        .then(() => loadNotifications())
        .catch((error: unknown) => {
          const message =
            error instanceof Error ? error.message : String(error);
          alert(message);
        });
    });
  };

  return (
    <section className="flex flex-col items-center pb-20 w-full">
      {notifications?.length === 0 && (
        <h2 className="text-gray-500 mt-6 text-xl font-bold">
          Notifications empty
        </h2>
      )}
      {notifications?.map((notification) => (
        <article key={notification.id} className="w-full">
          {notification.text === "Follow" && (
            <div className="flex items-center p-1 border-b-gray-400 border-b-2">
              <ProfileImage
                name={notification.user.name}
                image={notification.user.image}
              />
              <a
                onClick={(event) => handleProfile(event, notification.user.id)}
                className="text-center m-2 text-color2 font-semibold ml-3"
                href=""
              >
                {notification.user.name}
              </a>
              <p>follow you </p>
              <button
                onClick={() => handleDeleteNotification(notification.id)}
                className="ml-auto rounded-lg hover:bg-color4 hover:scale-110 "
              >
                🗑️
              </button>
            </div>
          )}
          {notification.text === "Like" && notification.post && (
            <div className="flex items-center p-1 border-b-gray-400 border-b-2">
              <ProfileImage
                name={notification.user.name}
                image={notification.user.image}
              />
              <a
                onClick={(event) => handleProfile(event, notification.user.id)}
                className="text-center m-2 text-color2 font-semibold ml-3"
                href=""
              >
                {notification.user.name}
              </a>
              <p>like your post</p>
              <div className="flex flex-col ml-4 items-center border-3">
                <Image
                  unoptimized
                  width={48}
                  height={48}
                  className="w-14 object-contain"
                  src={notification.post.image}
                  alt=""
                />
              </div>
              <button
                onClick={() => handleDeleteNotification(notification.id)}
                className="ml-auto rounded-lg hover:bg-color4 hover:scale-110 "
              >
                🗑️
              </button>
            </div>
          )}
          {notification.text === "Comment" && notification.post && (
            <div className="flex items-center p-1 border-b-gray-400 border-b-2">
              <ProfileImage
                name={notification.user.name}
                image={notification.user.image}
              />
              <a
                onClick={(event) => handleProfile(event, notification.user.id)}
                className="text-center m-2 text-color2 font-semibold ml-3"
                href=""
              >
                {notification.user.name}
              </a>
              <p>comment your post</p>
              <div className="flex flex-col ml-4 items-center border-3">
                <Image
                  unoptimized
                  width={48}
                  height={48}
                  className="w-14 object-contain"
                  src={notification.post.image}
                  alt=""
                />
              </div>
              <button
                onClick={() => handleDeleteNotification(notification.id)}
                className="ml-auto rounded-lg hover:bg-color4 hover:scale-110 "
              >
                🗑️
              </button>
            </div>
          )}
        </article>
      ))}
      {notifications?.length > 0 && (
        <button
          onClick={handleDeleteAllNotifications}
          disabled={isPending}
          className="mt-4 button w-32 bg-color4 text-white border-none rounded-xl m-1 px-3 py-1 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3"
        >
          {isPending ? "Cleaning..." : "Clean all"}
        </button>
      )}
    </section>
  );
}
