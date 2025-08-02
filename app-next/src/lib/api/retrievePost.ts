import { validateId } from "./helpers/validators";

export default function retrievePost(userId: string, postId: string) {
  validateId(userId);
  validateId(postId);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error("API URL is not defined in environment variables.");
  }

  return fetch(`${apiUrl}/posts/${postId}`, {
    headers: {
      Authorization: `Bearer ${userId}`,
    },
  }).then((res) => {
    if (res.status === 200) {
      return res.json();
    } else if (res.status === 400) {
      return res.json().then((body) => {
        throw new Error(body.error);
      });
    } else {
      throw new Error(`Unexpected response status: ${res.status}`);
    }
  });
}
