import { validateId } from "../helpers/validators";

export default function createChat(
  userId: string,
  otherUser: string
): Promise<void> {
  validateId(userId);
  validateId(otherUser);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error("API URL is not defined in environment variables.");
  }

  return fetch(`${apiUrl}/chats`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${userId}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ otherUser }),
  }).then((res) => {
    if (res.status === 200) {
      return res.json();
    } else if (res.status === 400) {
      return res.json().then((body) => {
        throw new Error(body.error);
      });
    } else {
      throw new Error(
        `An unexpected error occurred while creating the chat. Status code: ${res.status}`
      );
    }
  });
}
