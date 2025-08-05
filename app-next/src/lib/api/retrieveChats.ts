import { validateId } from "../helpers/validators";

export default function retrieveChats(userId: string) {
  validateId(userId);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error("API URL is not defined in environment variables.");
  }

  return fetch(`${apiUrl}/chats`, {
    headers: { Authorization: `Bearer ${userId}` },
  }).then((res) => {
    if (res.status === 200) {
      return res.json().then((chats) => chats);
    } else if (res.status === 400) {
      return res.json().then((err) => {
        throw new Error(err.error);
      });
    } else {
      throw new Error(`Unexpected response status: ${res.status}`);
    }
  });
}
