"use client";

import { useEffect } from "react";
import cookiesToken from "@/lib/api/helpers/cookiesToken";
import { useRouter } from "next/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const token = cookiesToken.get();

    if (token) router.push("/home");
  }, []);

  return (
    <main className="min-h-screen w-screen flex items-center justify-center">
      {children}
    </main>
  );
}
