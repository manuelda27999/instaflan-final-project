export default function extractUserIdFromToken(token: string): string {
  if (!token) return "";

  const dataB64 = token.slice(token.indexOf(".") + 1, token.lastIndexOf("."));

  try {
    const decoded =
      typeof atob === "function"
        ? atob(dataB64)
        : (() => {
            const buffer = (globalThis as unknown as {
              Buffer?: {
                from(input: string, encoding: string): { toString(encoding: string): string };
              };
            }).Buffer;

            if (buffer && typeof buffer.from === "function") {
              return buffer.from(dataB64, "base64").toString("utf-8");
            }

            return "";
          })();

    if (!decoded) return "";

    const data = JSON.parse(decoded);
    return data.sub ?? "";
  } catch {
    return "";
  }
}
