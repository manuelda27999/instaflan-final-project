import { validateId, validateImage, validateText } from "./helpers/validators";

export default function editPost(
  userId: string,
  postId: string,
  image: string,
  text: string
) {
  validateId(userId);
  validateId(postId);
  validateImage(image);
  validateText(text);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error("API URL is not defined in environment variables.");
  }

  return fetch(`${apiUrl}/posts/${postId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${userId}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ image, text }),
  }).then((res) => {
    if (res.status === 200) {
      return;
    } else if (res.status === 400) {
      return res.json().then((body) => {
        throw new Error(body.error);
      });
    } else {
      throw new Error(
        `An unexpected error occurred while editing the post. Status code: ${res.status}`
      );
    }
  });
}
