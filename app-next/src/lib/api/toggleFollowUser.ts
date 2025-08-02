import { validateId } from "./helpers/validators";

export default function toggleFollowUser(
  userId: string,
  userIdProfile: string
) {
  validateId(userId);
  validateId(userIdProfile);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error("API URL is not defined in environment variables.");
  }

  return fetch(`${apiUrl}/users/${userIdProfile}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${userId}`,
    },
  }).then((res) => {
    if (res.status === 200) {
      return;
    } else if (res.status === 400) {
      res.json().then((body) => {
        throw new Error(body.error);
      });
    } else {
      throw new Error("Unexpected response status: " + res.status);
    }
  });
}
