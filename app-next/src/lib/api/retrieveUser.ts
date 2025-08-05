import { validateId } from "../helpers/validators";

export default function retrieveUser(token: string) {
  validateId(token);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error("API URL is not defined in environment variables.");
  }

  return fetch(`${apiUrl}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
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
