"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import retrieveChats from "@/lib/api/retrieveChats";
import retrieveUser from "@/lib/api/retrieveUser";

interface Chat {
  id: string;
  users: { id: string; name: string; image: string }[];
  messages: Message[];
  unreadFor?: string[];
}

interface Message {
  author: string;
  delete?: boolean;
  edit?: boolean;
  id: string;
  text: string;
}

export default function Messages() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    let active = true;

    startTransition(() => {
      Promise.all([retrieveUser(), retrieveChats()])
        .then(([user, chats]) => {
          if (!active) return;
          setCurrentUserId(user?.id ?? null);
          setChats(chats);
        })
        .catch((error: unknown) => {
          const message =
            error instanceof Error ? error.message : String(error);
          alert(message);
        });
    });

    return () => {
      active = false;
    };
  }, []);

  const handleNavigateChat = (
    event: React.MouseEvent<HTMLAnchorElement>,
    chatId: string
  ) => {
    event.preventDefault();
    router.push(`/messages/${chatId}`);
  };

  return (
    <section className="flex flex-col items-center pb-20 w-full">
      {chats?.length === 0 && (
        <h2 className="text-gray-500 mt-6 text-xl font-bold">Messages empty</h2>
      )}
      {chats?.length > 0 &&
        chats?.map((chat) => (
          <a
            onClick={(event) => handleNavigateChat(event, chat.id)}
            key={chat.id}
            className={
              currentUserId && chat.unreadFor?.includes(currentUserId)
                ? "w-full flex flex-col border-b-2 bg-slate-200  border-b-gray-400 p-1 hover:bg-gray-300 cursor-pointer"
                : "w-full flex flex-col border-b-2  border-b-gray-400 p-1 hover:bg-gray-300 cursor-pointer"
            }
          >
            <div className="flex flex-col gap-1">
              {chat.users.map((user) => (
                <article
                  key={user.id}
                  className="flex justify-start items-center pl-3"
                >
                  <Image
                    unoptimized
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover mr-2"
                    src={user.image || "/images/default-profile.webp"}
                    alt="user profile image"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/images/default-profile.webp";
                    }}
                  />
                  <p className="m-2 text-color1 font-semibold ml-3">
                    {user.name}
                  </p>
                </article>
              ))}
            </div>
            <p
              className={
                currentUserId && chat.unreadFor?.includes(currentUserId)
                  ? "m-2 ml-3 mb-0 font-bold"
                  : "m-2 ml-3 mb-0"
            }
            >
              {isPending
                ? "Loading..."
                : chat.messages[chat.messages.length - 1]?.text}
            </p>
          </a>
        ))}
    </section>
  );
}
