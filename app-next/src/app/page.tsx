"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.push("/login");
  }, []);

  return null; // or a spinner/loading UI
}
