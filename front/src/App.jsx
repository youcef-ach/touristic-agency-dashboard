import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Home from "./Pages/home/home.jsx";
import { createContext, useEffect, useState, useRef } from "react";
import Dashboard from "./Pages/dashboard/dashboard.jsx";
import Auth from "./Pages/auth/Auth.jsx";
import axios from "axios";

export const windowCtx = createContext();

const myRouter = createBrowserRouter([
  {
    path: "/",
    Component: Home,
    children: [
      {
        path: "dashboard",
        Component: Dashboard,
      },
      {
        path: "signup",
        Component: Auth,
      },
    ],
  },
]);

function App() {
  const [winWidth, setWinWidth] = useState(window.innerWidth);
  const csrf = useRef("");

  useEffect(() => {
    axios
      .get("http://localhost:8000/csrf/", { withCredentials: true })
      .then((res) => {
        csrf.current = res.data.csrftoken;
      });
  }, []);

  useEffect(() => {
    window.addEventListener("resize", () => setWinWidth(window.innerWidth));
  }, []);

  return (
    <windowCtx.Provider value={{ winWidth, csrf }}>
      <RouterProvider router={myRouter} />
    </windowCtx.Provider>
  );
}

export default App;
