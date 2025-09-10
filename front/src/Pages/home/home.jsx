import { Layout } from "antd";
import Navbar from "../navbar/Navbar";
import { Outlet, Navigate, useLoaderData } from "react-router-dom";
import MobileNav from "../navbar/MobileNav";
import { windowCtx } from "../../App";
import { useContext } from "react";
import { Content } from "antd/es/layout/layout";
import "./home.css";
import StandardHeader from "./standardHeader";
import { isLoggedIn } from "../../api/isLoggedIn";

function home() {
  
  const { winWidth } = useContext(windowCtx);
  const loaderData = useLoaderData();
  console.log(loaderData);

  if (isLoggedIn())
    return (
      <Layout className="fullHW">
        {winWidth > 900 ? <Navbar /> : <MobileNav />}
        <Layout className="fullHW secondLayout">
          <StandardHeader />
          <Content className="fullHW contentContainer">
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    );
  else return <Navigate to="/auth" />;
}

export default home;
