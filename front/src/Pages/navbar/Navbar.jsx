import Sider from "antd/es/layout/Sider";
import { Menu, Flex, Divider, Typography, ConfigProvider } from "antd";
import "./Navbar.css";
import Logo from "../../assets/icons/logo.svg";
import { Link } from "react-router-dom";
import users from "../../assets/icons/users.svg";
import home from "../../assets/icons/home.svg";
import logout from "../../assets/icons/logout.svg";
import { useRef, useState } from "react";
const { Text, Title } = Typography;
import david from "../../assets/images/david.webp";

const menuItems = [
  {
    key: "1",
    label: (
      <Link to="/">
        <Text className="menuText">Dashboard</Text>
      </Link>
    ),
    icon: <img src={home} />,
  },
  {
    key: "2",
    label: (
      <Link to="/">
        <Text className="menuText">All users</Text>
      </Link>
    ),
    icon: <img src={users} />,
  },
  {
    key: "3",
    label: (
      <Link to="/">
        <Text className="menuText">All trips</Text>
      </Link>
    ),
    icon: <img src={users} />,
  },
];

function Navbar() {
  const [collapsed, setCollapsed] = useState(false);

  const user = useRef({
    name: "david",
    email: "david@gmail.com",
    image: "../../assets/images/david.webp",
  });

  return (
    <Sider
      width={270}
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      className="fullH sider"
    >
      <Flex className="logoFlex" justify="start" align="center" gap={6}>
        <img src={Logo} className="logo" />
        {!collapsed ? (
          <Title level={1} className="logoTitle noMP">
            Tourvisto
          </Title>
        ) : null}
      </Flex>
      <Divider />
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              itemColor: "#7f7e83",
              itemSelectedBg: "#256FF1",
              itemSelectedColor: "#FFFFFF",
            },
          },
        }}
      >
        <Menu
          defaultSelectedKeys={["1"]}
          items={menuItems}
          className="navMenu"
        />
      </ConfigProvider>
      <Flex gap={14} className="footerFlex" justify="center" align="center">
        {!collapsed ? (
          <>
            {" "}
            <img className="user" src={david} />
            <Flex vertical justify="center" align="center" gap={4}>
              <Text>{user.current.name}</Text>
              <Text type="secondary">{user.current.email}</Text>
            </Flex>
          </>
        ) : null}
        <img className="icon" src={logout} />
      </Flex>
    </Sider>
  );
}

export default Navbar;