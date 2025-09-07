import { Layout, Typography, Button, Flex } from "antd";
import Navbar from "../navbar/Navbar";
import { Outlet } from "react-router-dom";
import MobileNav from "../navbar/MobileNav";
import { windowCtx } from "../../App";
import { useContext } from "react";
import { Content, Header } from "antd/es/layout/layout";
import "./home.css";
import plus from "../../assets/icons/plus.svg";

const { Text } = Typography;

function home() {
  const winWidth = useContext(windowCtx);

  return (
    <Layout className="fullHW">
      {winWidth > 900 ? <Navbar /> : <MobileNav />}
      <Layout className="fullHW secondLayout">
        <Header className="standardHeader">
          <Flex className="helloFlex" justify="space-between" align="center" wrap>
            <Flex
              vertical
              justify="center"
              align="center"
              style={{ width: 467, height: 67 }}
            >
              <Text className="hello">Welcome Adrian👋</Text>
              <Text className="helloDesc">
                Track activity, trends, and popular destinations in real time
              </Text>
            </Flex>
            <Button
              className="createButton"
              type="primary"
              icon={<img src={plus} className="smallIcon" />}
            >
              Create a trip
            </Button>
          </Flex>
        </Header>
        <Content className="fullHW">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default home;
