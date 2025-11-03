"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

import { useModal } from "@/context/ModalContext";
import retrieveChat from "@/lib/api/retrieveChat";
import sendMessage from "@/lib/api/sendMessage";
import retrieveUser from "@/lib/api/retrieveUser";
import ProfileImage from "@/app/components/ProfileImage";

interface Chat {
  id: string;
  users: { id: string; name: string; image: string }[];
  messages: Message[];
}

interface Message {
  author: string;
  delete?: boolean;
  edit?: boolean;
  id: string;
  text: string;
}

export default function Chat() {
  const [chat, setChat] = useState<Chat | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const pathname = usePathname();

  const router = useRouter();

  const { openModal } = useModal();

  useEffect(() => {
    const chatId = pathname.slice(10);

    if (typeof chatId !== "string") throw new Error("Chat ID must be a string");

    let active = true;

    startTransition(() => {
      Promise.all([retrieveUser(), retrieveChat(chatId)])
        .then(([user, newChat]) => {
          if (!active) return;
          setCurrentUserId(user?.id ?? null);
          setChat(newChat);
        })
        .catch((error: unknown) => {
          const message =
            error instanceof Error ? error.message : String(error);
          alert(message);
        });
    });

    const intervalId = setInterval(() => {
      retrieveChat(chatId)
        .then((newChat) => {
          if (!active) return;
          setChat((prev) =>
            JSON.stringify(prev) === JSON.stringify(newChat) ? prev : newChat
          );
        })
        .catch((error: unknown) => {
          const message =
            error instanceof Error ? error.message : String(error);
          alert(message);
        });
    }, 2000);

    return () => {
      active = false;
      clearInterval(intervalId);
    };
  }, [pathname]);

  const handleSendMessage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const text = (form.elements.namedItem("message") as HTMLInputElement).value;

    const chatId = pathname.slice(10);

    if (typeof chatId !== "string") throw new Error("Chat ID must be a string");

    startTransition(() => {
      sendMessage(chatId, text)
        .then(() =>
          retrieveChat(chatId).then((chat) => {
            (form.elements.namedItem("message") as HTMLInputElement).value = "";
            setChat(chat);
          })
        )
        .catch((error: unknown) => {
          const message =
            error instanceof Error ? error.message : String(error);
          alert(message);
        });
    });
  };

  const handleProfile = (
    event: React.MouseEvent<HTMLAnchorElement>,
    userIdProfile: string
  ) => {
    event.preventDefault();
    router.push(`/profile/${userIdProfile}/posts`);
  };

  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    const pageHeight = document.body.scrollHeight;

    window.scroll({
      top: pageHeight,
      behavior: "smooth",
    });
  }, [chat?.messages.length]);

  return (
    <section className="flex flex-col">
      <div className="fixed w-full bg-white flex justify-between items-center border-b-2 border-gray-400 py-1 px-2">
        <div className="flex items-center">
          {chat && (
            <ProfileImage
              name={chat?.users[0].name}
              image={chat?.users[0].name}
            />
          )}
          <a
            onClick={(event) =>
              handleProfile(event, chat?.users[0].id ? chat?.users[0].id : "")
            }
            className="m-2 text-color1 font-semibold ml-3"
            href=""
          >
            {chat?.users[0].name}
          </a>
        </div>
        <button
          onClick={handleBack}
          className="button bg-color4 text-white border-none rounded-xl px-3 py-1 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3"
        >
          Back
        </button>
      </div>
      <div className="flex flex-col mx-2 my-1 pb-28 pt-14">
        {chat?.messages.map((message) => (
          <article
            key={message.id}
            className={
              currentUserId && message.author === currentUserId
                ? "ml-12 flex justify-end"
                : "mr-12 flex"
            }
          >
            {message.delete ? (
              <p className="italic text-gray-600 m-1 py-1 px-2 w-auto rounded-xl bg-color5">
                Message deleted
              </p>
            ) : message.edit ? (
              <div className="flex flex-col items-end bg-color5 w-auto m-1 px-2 py-1 rounded-xl">
                <div className="flex ">
                  <p className="">{message?.text}</p>
                  {currentUserId && message.author === currentUserId && (
                    <button
                      onClick={() =>
                        openModal("edit-delete-message", { message: message })
                      }
                      className="ml-2 rounded-lg hover:bg-color4 hover:scale-110 "
                    >
                      ✏️
                    </button>
                  )}
                </div>
                <p className="italic text-gray-600 text-xs">Edited</p>
              </div>
            ) : (
              <div className="flex flex-start items-end bg-color5 w-auto m-1 px-2 py-1 rounded-xl">
                <p className="">{message?.text}</p>
                {currentUserId && message.author === currentUserId && (
                  <button
                    onClick={() =>
                      openModal("edit-delete-message", { message: message })
                    }
                    className="ml-2 rounded-lg hover:bg-color4 hover:scale-110 "
                  >
                    ✏️
                  </button>
                )}
              </div>
            )}
          </article>
        ))}
      </div>
      <form
        onSubmit={handleSendMessage}
        className="fixed bottom-14 flex justify-around p-3 w-full"
      >
        <input
          id="message"
          placeholder=" ..."
          className="w-full rounded-full border-4 mr-3 pl-3 border-black"
          type="text"
        />
        <button
          disabled={isPending}
          className="button bg-color4 text-white border-none rounded-xl px-3 py-1 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isPending ? "Sending..." : "Send"}
        </button>
      </form>
    </section>
  );
}
