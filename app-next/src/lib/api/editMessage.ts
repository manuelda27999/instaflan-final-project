import { validateId, validateText } from "../helpers/validators";

export default function editMessage(
  userId: string,
  messageId: string,
  text: string
) {
  validateId(userId);
  validateId(messageId);
  validateText(text);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error("API URL is not defined in environment variables.");
  }

  return fetch(`${apiUrl}/chats/${messageId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${userId}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  }).then((res) => {
    if (res.status === 200) {
      return;
    } else if (res.status === 400) {
      return res.json().then((body) => {
        throw new Error(body.error);
      });
    } else {
      throw new Error(`Unexpected status code: ${res.status}`);
    }
  });
}
