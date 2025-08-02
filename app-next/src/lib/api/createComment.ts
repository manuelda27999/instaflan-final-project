import { validateId, validateText } from "./helpers/validators";

export default function createComment(
  userId: string,
  postId: string,
  text: string
): Promise<void> {
  validateId(userId);
  validateId(postId);
  validateText(text);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error("API URL is not defined in environment variables.");
  }

  return fetch(`${apiUrl}/posts/${postId}/comments`, {
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
        `An unexpected error occurred while creating the comment. Status code: ${res.status}`
      );
    }
  });
}
