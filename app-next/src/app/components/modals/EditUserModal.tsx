"use client";

import { useTransition } from "react";
import editUser from "@/lib/api/editUser";

interface User {
  name: string;
  image: string;
  description: string;
}

interface EditUserModalProps {
  user: User;
  onEditUser: () => void;
  onHideEditUser: () => void;
}

export default function EditUserModal(props: EditUserModalProps) {
  const user = props.user;
  const [isPending, startTransition] = useTransition();

  const handleSubmitUser = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const image = (form.elements.namedItem("image") as HTMLInputElement).value;
    const description = (
      form.elements.namedItem("description") as HTMLInputElement
    ).value;

    startTransition(() => {
      editUser(name, image, description)
        .then(() => {
          props.onEditUser();
        })
        .catch((error: unknown) => {
          const message =
            error instanceof Error ? error.message : String(error);
          alert(message);
        });
    });
  };

  const handleCancelEditUser = () => props.onHideEditUser();

  return (
    <div className="fixed z-10 top-0 left-0 right-0 bottom-0 m-auto bg-black bg-opacity-60 w-full h-full flex flex-col items-center justify-center">
      {user && (
        <form
          onSubmit={handleSubmitUser}
          className="flex flex-col justify-center items-center p-6 bg-color5 border-solid border-black border-4 rounded-lg w-64"
          action=""
        >
          <h3 className="font-bold text-xl text-color1 mb-4">Edit profile</h3>
          <p className="m-1 text-color1 font-semibold">Name</p>
          <input
            className="p-2 rounded-xl border-color2 border-2"
            id="name"
            type="text"
            defaultValue={user.name ? user.name : undefined}
          />
          <p className="m-1 text-color1 font-semibold">Image</p>
          <input
            className="p-2 rounded-xl border-color2 border-2"
            id="image"
            type="url"
            defaultValue={user.image ? user.image : undefined}
          />
          <p className="m-1 text-color1 font-semibold">Description</p>
          <textarea
            className="p-1 rounded-xl border-color2 border-2"
            id="description"
            name=""
            cols={25}
            rows={5}
            defaultValue={user.description ? user.description : undefined}
          ></textarea>
          <div className="flex justify-around mt-5 w-full">
            <button
              type="submit"
              disabled={isPending}
              className="bg-color4 text-white border-none rounded-xl px-3 py-1 font-bold text-lg cursor-pointer transition duration-300 hover:bg-color3"
            >
              {isPending ? "Saving..." : "Edit"}
            </button>
            <button
              onClick={handleCancelEditUser}
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
