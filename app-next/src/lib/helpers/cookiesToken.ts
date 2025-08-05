"use client";

const cookiesToken = {
  get(): string {
    const match = document.cookie.match(new RegExp("(^| )token=([^;]+)"));

    if (!match) throw new Error("Token not found in cookies");

    return match[2];
  },

  set(token: string, days: number = 7): void {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `token=${token}; ${expires}; path=/`;
  },

  delete(): void {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  },
};

export default cookiesToken;
