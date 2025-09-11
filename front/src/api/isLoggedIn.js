import { jwtDecode } from "jwt-decode";

export const isLoggedIn = () => {
  if (
    localStorage.getItem("access-token") ||
    localStorage.getItem("refresh-token")
  ) {
    const decoded = jwtDecode(localStorage.getItem("access-token"));
    return {
      logged: true,
      name: decoded.name,
      admin: decoded.is_superuser,
      id: decoded.id,
    };
  } else return false;
};