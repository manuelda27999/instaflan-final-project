"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        gap: "1rem",
      }}
    >
      <h1>Welcome to InstaFlan</h1>
      <div>
        <button
          className="cursor-pointer mr-3"
          onClick={() => router.push("/login")}
        >
          Login
        </button>
        <button
          className="cursor-pointer"
          onClick={() => router.push("/register")}
        >
          Register
        </button>
      </div>
    </main>
  );
}
