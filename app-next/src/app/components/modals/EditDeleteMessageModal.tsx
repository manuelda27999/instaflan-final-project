"use client";

import deleteMessage from "@/lib/api/deleteMessage";
import editMessage from "@/lib/api/editMessage";
import cookiesToken from "@/lib/helpers/cookiesToken";

interface EditDeleteMessageModalProps {
  message: Message;
  onHideEditDeletePost: () => void;
}

interface Message {
  author: string;
  delete?: boolean;
  edit?: boolean;
  id: string;
  text: string;
}

export default function EditDeleteMessageModal(
  props: EditDeleteMessageModalProps
) {
  const message = props.message;

  const token = cookiesToken.get();

  const handleEditMessage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const text = (form.elements.namedItem("text") as HTMLInputElement).value;

    try {
      editMessage(token, message.id, text)
        .then(() => {
          props.onHideEditDeletePost();
        })
        .catch((error) => {
          alert(error.message);
        });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      alert(message);
    }
  };

  const handleDeleteMessage = () => {
    try {
      deleteMessage(token, message.id)
        .then(() => {
          props.onHideEditDeletePost();
        })
        .catch((error) => {
          alert(error.message);
        });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      alert(message);
    }
  };

  const handleCancelEditDeleteMessage = () => props.onHideEditDeletePost();

  return (
    <div className="fixed z-10 top-0 left-0 right-0 bottom-0 m-auto bg-black bg-opacity-60 w-full h-full flex flex-col items-center justify-center">
      {message && (
        <form
          onSubmit={handleEditMessage}
          className="flex flex-col justify-center items-center p-6 bg-color5 border-solid border-black border-4 rounded-lg w-64"
          action=""
        >
          <h3 className="font-bold text-xl text-color1 mb-4 text-center">
            Edit and delete message
          </h3>
          <p className="m-1 text-color1 font-semibold">Text</p>
          <textarea
            className="p-1 rounded-xl border-color2 border-2"
            id="text"
            name=""
            cols={25}
            rows={3}
            defaultValue={message.text ? message.text : undefined}
          ></textarea>
          <div className="flex flex-col mt-5 w-full">
            <div className="flex justify-around mb-5">
              <button
                type="submit"
                className="bg-color4 text-white border-none rounded-xl px-3 py-1 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3"
              >
                Edit
              </button>
              <button
                onClick={handleDeleteMessage}
                type="button"
                className="bg-color4 text-white border-none rounded-xl px-3 py-1 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3"
              >
                Delete
              </button>
            </div>
            <button
              onClick={handleCancelEditDeleteMessage}
              type="button"
              className="bg-color4 text-white border-none rounded-xl px-3 py-1 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
