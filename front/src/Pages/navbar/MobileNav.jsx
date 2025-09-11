import { Drawer, Menu } from "antd";
import mobileMenu from "../../assets/icons/menu.svg";
import Logo from "../../assets/icons/logo.svg";
import { Header } from "antd/es/layout/layout";
import { Flex, Typography, ConfigProvider } from "antd";
import { useState, useRef, useMemo } from "react";
import users from "../../assets/icons/users.svg";
import home from "../../assets/icons/home.svg";
import logout from "../../assets/icons/logout.svg";
import map from "../../assets/icons/itinerary.svg";
import { Link } from "react-router-dom";
import david from "../../assets/images/david.webp";

const { Title, Text } = Typography;

function MobileNav() {
  const [open, setOpen] = useState(false);
  const user = useRef({
    name: "david",
    email: "david@gmail.com",
    image: "../../assets/images/david.webp",
  });

  const handleClose = () => setOpen(false);

  const menuItems = useMemo(
    () => [
      {
        key: "1",
        label: (
          <Link to="/" onClick={handleClose}>
            <Text className="menumText">Dashboard</Text>
          </Link>
        ),
        icon: <img src={home} />,
      },
      {
        key: "2",
        label: (
          <Link to="/allUsers" onClick={handleClose}>
            <Text className="menumText">All users</Text>
          </Link>
        ),
        icon: <img src={users} />,
      },
      {
        key: "3",
        label: (
          <Link to="/newTrip" onClick={handleClose}>
            <Text className="menumText">All trips</Text>
          </Link>
        ),
        icon: <img src={map} />,
      },
    ],
    []
  );

  return (
    <Header className="header fullW">
      <Flex className="logoFlex noMP" justify="start" align="center" gap={6}>
        <img src={Logo} className="logo" />
        <Title level={1} className="logoTitle logoMtitle noMP">
          Tourvisto
        </Title>
      </Flex>
      <img
        style={{ cursor: "pointer" }}
        src={mobileMenu}
        className="subLogo"
        onClick={() => setOpen(true)}
      />
      <Drawer
        placement="left"
        width={"60%"}
        open={open}
        onClose={handleClose}
        closable={false}
      >
        <Flex
          vertical
          justify="space-between"
          align="center"
          className="fullHW"
        >
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
              className="fullW"
              defaultSelectedKeys={[]}
              items={menuItems}
            />
          </ConfigProvider>
          <Flex gap={14} className="footerFlex" justify="center" align="center">
            <img className="user" src={david} />
            {/* <Flex vertical justify="center" align="center" gap={4}>
              <Text>{user.current.name}</Text>
              <Text type="secondary">{user.current.email}</Text>
            </Flex> */}
            <img className="icon" src={logout} />
          </Flex>
        </Flex>
      </Drawer>
    </Header>
  );
}

export default MobileNav;
