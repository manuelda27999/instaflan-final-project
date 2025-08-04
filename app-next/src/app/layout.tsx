"use client";

import "./globals.css";
import { AppContextProvider } from "@/context/AppContextProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AppContextProvider>{children}</AppContextProvider>
      </body>
    </html>
  );
}
