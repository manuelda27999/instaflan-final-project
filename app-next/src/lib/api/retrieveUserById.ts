import { validateId } from "../helpers/validators";

interface User {
  name: string;
  image: string;
  description: string;
  followed?: string[];
  following?: string[];
  follow?: boolean;
}

export default function retrieveUserById(
  userId: string,
  userIdProfile: string
): Promise<User> {
  validateId(userId);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error("API URL is not defined in environment variables.");
  }

  return fetch(`${apiUrl}/users/${userIdProfile}`, {
    headers: {
      Authorization: `Bearer ${userId}`,
    },
  }).then((res) => {
    if (res.status === 200) {
      return res.json().then((body) => {
        const user = body;

        return user;
      });
    } else if (res.status === 400) {
      return res.json().then((body) => {
        throw new Error(body.error);
      });
    } else {
      throw new Error(
        `An unexpected error occurred while retrieving the user. Status code: ${res.status}`
      );
    }
  });
}
