"use client";

import authenticateUser from "@/lib/api/authenticateUser";
import cookiesToken from "@/lib/helpers/cookiesToken";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const handleLoginSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;

    try {
      authenticateUser(email, password)
        .then((result) => {
          cookiesToken.set(result);

          router.push("/home");
        })
        .catch((error) => {
          alert(error.message);
        });
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <main className="bg-color5 flex flex-col justify-start h-screen p-5 w-full">
      <form onSubmit={handleLoginSubmit} className="">
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
            className="p-2 rounded-xl border-color2 border-2 w-full bg-white"
            placeholder="email"
            type="email"
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
            className="p-2 rounded-xl border-color2 border-2 w-full bg-white"
            placeholder="password"
            type="password"
          />
        </div>
        <button
          type="submit"
          className="bg-color4 text-white border-none rounded-xl px-4 py-3 font-bold text-xl cursor-pointer transition duration-300 hover:bg-color3"
        >
          Enter
        </button>
      </form>

      <Link
        className="text-color1 text-xl fixed bottom-3 left-1/2 transform -translate-x-1/2 block hover:underline"
        href="/register"
      >
        Go to register
      </Link>
    </main>
  );
}
