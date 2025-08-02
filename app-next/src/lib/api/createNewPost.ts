import { validateId, validateImage, validateText } from "./helpers/validators";

export default function createNewPost(
  author: string,
  image: string,
  text: string
): Promise<void> {
  validateId(author);
  validateImage(image);
  validateText(text);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error("API URL is not defined in environment variables.");
  }

  return fetch(`${apiUrl}/posts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${author}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ image, text }),
  }).then((res) => {
    if (res.status === 201) {
      return;
    } else if (res.status === 400) {
      return res.json().then((body) => {
        throw new Error(body.error);
      });
    } else {
      throw new Error(
        `An unexpected error occurred while creating the post. Status code: ${res.status}`
      );
    }
  });
}
