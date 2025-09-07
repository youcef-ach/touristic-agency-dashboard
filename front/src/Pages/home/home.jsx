import { Layout, Typography, Button, Flex } from "antd";
import Navbar from "../navbar/Navbar";
import { Outlet } from "react-router-dom";
import MobileNav from "../navbar/MobileNav";
import { windowCtx } from "../../App";
import { useContext } from "react";
import { Content, Header } from "antd/es/layout/layout";
import "./home.css";
import plus from "../../assets/icons/plus.svg";
import StandardHeader from "./standardHeader";

const { Text } = Typography;

function home() {
  const winWidth = useContext(windowCtx);

  return (
    <Layout className="fullHW">
      {winWidth > 900 ? <Navbar /> : <MobileNav />}
      <Layout className="fullHW secondLayout">
        <StandardHeader />
        <Content className="fullHW">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default home;