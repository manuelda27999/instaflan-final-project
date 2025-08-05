import {
  validateName,
  validateEmail,
  validatePassword,
} from "../helpers/validators";

export default function registerUser(
  name: string,
  email: string,
  password: string
) {
  validateName(name);
  validateEmail(email);
  validatePassword(password);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error("API URL is not defined in environment variables.");
  }

  return fetch(`${apiUrl}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  }).then((res) => {
    if (res.status === 201) {
      return;
    } else if (res.status === 400) {
      return res.json().then((body) => {
        throw new Error(body.error);
      });
    } else {
      throw new Error(
        `An unexpected error occurred while registering. Status code: ${res.status}`
      );
    }
  });
}
