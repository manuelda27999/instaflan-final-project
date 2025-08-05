import { validateEmail, validatePassword } from "../helpers/validators";

export default function authenticateUser(
  email: string,
  password: string
): Promise<string> {
  validateEmail(email);
  validatePassword(password);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error("API URL is not defined in environment variables.");
  }

  return fetch(`${apiUrl}/users/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }).then((res) => {
    if (res.status === 200) {
      return res.json().then((body) => {
        const userId = body;

        return userId;
      });
    } else if (res.status === 400) {
      return res.json().then((body) => {
        throw new Error(body.error);
      });
    } else {
      throw new Error(
        `An unexpected error occurred while authenticating. Status code: ${res.status}`
      );
    }
  });
}
