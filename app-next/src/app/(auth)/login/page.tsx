import Link from "next/link";
import LoginForm from "./LoginForm";

export default function Login() {
  return (
    <main className="bg-color5 flex flex-col justify-start h-screen p-5 w-full">
      <LoginForm />

      <Link
        className="text-color1 text-xl fixed bottom-3 left-1/2 transform -translate-x-1/2 block hover:underline"
        href="/register"
      >
        Go to register
      </Link>
    </main>
  );
}
