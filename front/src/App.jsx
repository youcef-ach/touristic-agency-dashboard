import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Home from "./Pages/home/home.jsx";
import { createContext, useEffect, useState } from "react";

export const windowCtx = createContext();

const myRouter = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
]);

function App() {
  
  const [winWidth, setWinWidth] = useState(window.innerWidth);

  useEffect(() => {
    window.addEventListener("resize", () => setWinWidth(window.innerWidth));
  }, []);

  return (
    <windowCtx.Provider value={winWidth}>
      <RouterProvider router={myRouter} />
    </windowCtx.Provider>
  );
}

export default App;
