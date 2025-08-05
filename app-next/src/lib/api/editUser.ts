import {
  validateId,
  validateImage,
  validateText,
  validateName,
} from "../helpers/validators";

export default function editUser(
  userId: string,
  name: string,
  image: string,
  description: string
) {
  validateId(userId);
  validateName(name);
  validateImage(image);
  validateText(description);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error("API URL is not defined in environment variables.");
  }

  return fetch(`${apiUrl}/users`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${userId}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, image, description }),
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
