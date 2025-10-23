"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import authenticateUser from "@/lib/api/authenticateUser";
import { useModal } from "@/context/ModalContext";
import { useRouter } from "next/navigation";

type LoginState = { error: string | null };

const initialState: LoginState = { error: null };

function LoginForm() {
  const router = useRouter();
  const { openModal } = useModal();

  const [state, loginAction, isPending] = useActionState(
    async (prevState: LoginState, formData: FormData): Promise<LoginState> => {
      try {
        await authenticateUser(prevState, formData);

        router.push("/home");
        return { error: null };
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);

        return { error: message };
      }
    },
    initialState
  );

  useEffect(() => {
    if (state.error) {
      console.log("Showing error modal:", state.error);
      openModal("error-modal", {
        message: state.error,
        callback: (close: () => void) => {
          close();
        },
      });
    }
  }, [state.error]);

  return (
    <form action={loginAction} className="">
      <h2 className="text-5xl text-color1 mb-6 font-semibold">Login</h2>
      <div className="flex flex-col justify-start items-start mb-4">
        <label
          className="block text-xl font-semibold text-color1 mb-1 ml-1"
          htmlFor="email"
        >
          Email:
        </label>
        <input
          id="email"
          name="email"
          className="p-2 rounded-xl border-color2 border-2 w-full bg-white"
          placeholder="email"
          type="email"
          required
        />
      </div>
      <div className="flex flex-col justify-start items-start mb-4">
        <label
          className="block text-xl font-semibold text-color1 mb-1 ml-1"
          htmlFor="password"
        >
          Password:
        </label>
        <input
          id="password"
          name="password"
          className="p-2 rounded-xl border-color2 border-2 w-full bg-white"
          placeholder="password"
          type="password"
          required
        />
      </div>
      <SubmitBotton pending={isPending} />
    </form>
  );
}

function SubmitBotton({ pending }: { pending?: boolean }) {
  const status = useFormStatus();
  const disable = pending || status.pending;

  return (
    <button
      disabled={pending}
      type="submit"
      className="bg-color4 text-white border-none rounded-xl px-4 py-3 font-bold text-xl cursor-pointer transition duration-300 hover:bg-color3"
    >
      {disable ? "Loading..." : "Login"}
    </button>
  );
}

export default LoginForm;
