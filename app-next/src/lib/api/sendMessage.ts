import { validateId, validateText } from "../helpers/validators";

export default function sendMessage(
  userId: string,
  chatId: string,
  text: string
) {
  validateId(userId);
  validateId(chatId);
  validateText(text);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error("API URL is not defined in environment variables.");
  }

  return fetch(`${apiUrl}/chats/${chatId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${userId}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  }).then((res) => {
    if (res.status === 201) {
      return;
    } else if (res.status === 400) {
      return res.json().then((body) => {
        throw new Error(body.error);
      });
    } else {
      throw new Error(
        `An unexpected error occurred while sending the message. Status code: ${res.status}`
      );
    }
  });
}
