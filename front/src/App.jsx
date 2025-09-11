import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Pages/home/home.jsx";
import { createContext, useEffect, useState, useCallback } from "react";
import Dashboard from "./Pages/dashboard/dashboard.jsx";
import Auth from "./Pages/auth/Auth.jsx";
import { isLoggedIn } from "./api/isLoggedIn.js";
import { secureApi } from "./api/api.js";
import UsersTable from "./Pages/users/UsersTable.jsx";
import NewTrip from "./Pages/newTrip/newTrip.jsx";
// import CreateNewTrip from "./Pages/newTrip/CreateNewTrip.js";

export const windowCtx = createContext();
export const authCtx = createContext();

export const usersLoader = async (request) => {
  try {
    const url = new URL(request.request.url);
    const page = url.searchParams.get("page") || 1;
    const res = await secureApi.get("users/?page=" + page);
    return { data: res.data, page };
  } catch (err) {
    return "something went wrong";
  }
};

const myRouter = createBrowserRouter([
  {
    path: "/",
    Component: Home,
    children: [
      {
        path: "",
        Component: Dashboard,
      },
      {
        path: "allUsers/",
        Component: UsersTable,
        loader: usersLoader,
      },
      {
        path: "newTrip/",
        Component: NewTrip,
      },
      // {
      //   path: "api/createNewTrip",
      //   Component: CreateNewTrip,
      // },
    ],
  },
  {
    path: "/auth",
    Component: Auth,
  },
]);

function App() {
  const [winWidth, setWinWidth] = useState(window.innerWidth);
  const [logged, setLogged] = useState(isLoggedIn());

  const handleResize = useCallback(() => {
    setWinWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <authCtx.Provider value={{ logged, setLogged }}>
      <windowCtx.Provider value={{ winWidth }}>
        <RouterProvider router={myRouter} />
      </windowCtx.Provider>
    </authCtx.Provider>
  );
}

export default App;
