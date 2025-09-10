import { createBrowserRouter, RouterProvider, Outlet, redirect } from "react-router-dom";
import Home from "./Pages/home/home.jsx";
import { createContext, useEffect, useState, useRef, useCallback } from "react";
import Dashboard from "./Pages/dashboard/dashboard.jsx";
import Auth from "./Pages/auth/Auth.jsx";
import axios from "axios";
import { isLoggedIn } from "./api/isLoggedIn.js";

export const windowCtx = createContext();

const myRouter = createBrowserRouter([
  {
    path: "/",
    Component: Home,
    loader: () => {
      if (isLoggedIn()) return true
      else return redirect("/auth")
    },
    children: [
      {
        path: "dashboard",
        Component: Dashboard,
      },
    ],
  },
  {
    path: "/auth",
    Component: Auth,
  },
]);

function App() {
  const [winWidth, setWinWidth] = useState(window.innerWidth);
  const csrf = useRef("");
  const handleResize = useCallback(() => setWinWidth(window.innerWidth), []);

  // useEffect(() => {
  //   axios
  //     .get("http://localhost:8000/csrf/", { withCredentials: true })
  //     .then((res) => {
  //       csrf.current = res.data.csrftoken;
  //     });
  // }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <windowCtx.Provider value={{ winWidth, csrf }}>
      <RouterProvider router={myRouter} />
    </windowCtx.Provider>
  );
}

export default App;