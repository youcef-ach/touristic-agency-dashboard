import { Layout} from "antd";
import Navbar from "../navbar/Navbar";
import { Outlet } from "react-router-dom";
import MobileNav from "../navbar/MobileNav";
import { windowCtx } from "../../App";
import { useContext } from "react";
import { Content, Header } from "antd/es/layout/layout";
import "./home.css";
import StandardHeader from "./standardHeader";

function home() {
  const winWidth = useContext(windowCtx);

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
}

export default home;