import { redirect } from "next/navigation";
import { createSession } from "../helpers/session";
import { validateEmail, validatePassword } from "../helpers/validators";

export default function authenticateUser(
  prevState: any,
  formData: FormData
): Promise<void> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

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

        createSession(userId);

        return;
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
