"use client";

const cookiesToken = {
  exist(): boolean {
    if (typeof document === "undefined") return false;

    return document.cookie.includes("token=");
  },

  /**
   * Retrieves the token from cookies.
   * @returns {string} The token value.
   * @throws {Error} If the token is not found in cookies.
   */
  get(): string {
    if (typeof document === "undefined") return "";

    const match = document.cookie.match(new RegExp("(^| )token=([^;]+)"));

    if (!match) throw new Error("Token not found in cookies");

    return match[2];
  },

  /**
   * Sets the token in cookies with an optional expiration in days.
   * @param {string} token - The token to set.
   * @param {number} [days=7] - The number of days until the cookie expires.
   */
  set(token: string, days: number = 7): void {
    if (typeof document === "undefined") return;

    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `token=${token}; ${expires}; path=/`;
  },

  /**
   * Deletes the token from cookies.
   */
  delete(): void {
    if (typeof document === "undefined") return;

    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  },
};

export default cookiesToken;
