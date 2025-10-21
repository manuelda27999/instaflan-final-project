"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import cookiesToken from "@/lib/helpers/cookiesToken";

import extractUserIdFromToken from "@/lib/helpers/extractUserIdFromToken";
import retrieveChats from "@/lib/api/retrieveChats";

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
  const router = useRouter();

  const token = cookiesToken.get();
  const userId = extractUserIdFromToken(token);

  useEffect(() => {
    try {
      retrieveChats(token)
        .then((chats) => {
          setChats(chats);
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
  }, [token]);

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
              chat.unreadFor?.includes(userId)
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
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover mr-2"
                    src={user.image}
                    alt="user profile image"
                  />
                  <p className="m-2 text-color1 font-semibold ml-3">
                    {user.name}
                  </p>
                </article>
              ))}
            </div>
            <p
              className={
                chat.unreadFor?.includes(userId)
                  ? "m-2 ml-3 mb-0 font-bold"
                  : "m-2 ml-3 mb-0"
              }
            >
              {chat.messages[chat.messages.length - 1]?.text}
            </p>
          </a>
        ))}
    </section>
  );
}
