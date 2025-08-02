import { validateId } from "./helpers/validators";

export default function deleteAllNotifications(userId: string) {
  validateId(userId);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error("API URL is not defined in environment variables.");
  }

  return fetch(`${apiUrl}/notifications`, {
    method: "DELETE",
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
      throw new Error(
        `An unexpected error occurred while deleting notifications. Status code: ${res.status}`
      );
    }
  });
}
