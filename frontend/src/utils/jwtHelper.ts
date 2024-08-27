import { jwtDecode } from "jwt-decode";

type UserData = {
  email: string;
  id: string;
  name: string;
};

export function decodeUserToken(token: string | null) {
  return jwtDecode<UserData>(token || "");
}
