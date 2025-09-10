export const isLoggedIn = () => {
  if (
    localStorage.getItem("access-token") ||
    localStorage.getItem("refresh-token")
  )
    return true;
};