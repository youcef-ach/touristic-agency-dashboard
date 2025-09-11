import { Button, Flex, Typography } from "antd";
import { Header } from "antd/es/layout/layout";
import "./home.css";
import plus from "../../assets/icons/plus.svg";
import { authCtx } from "../../App";
import { useContext } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

function standardHeader() {
  const { logged } = useContext(authCtx);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const data = [
    [
      "Welcome " + logged.name + "👋",
      "Track activity, trends, and popular destinations in real time",
    ],
    ["Manage Users", "Filter, sort and access detailed user profiles"],
    ["Add new Trips", "View and generate AI travel plans"],
  ];

  const currentData =
    pathname == "/" ? data[0] : pathname == "/allUsers" ? data[1] : data[2];

  return (
    <Header className="standardHeader">
      <Flex
        className="helloFlex"
        justify="space-between"
        align="center"
        wrap
        gap={40}
      >
        <Flex className="helloSubFlex" vertical justify="center" align="start">
          <Text className="hello">{currentData[0]}</Text>
          <Text className="helloDesc">{currentData[1]}</Text>
        </Flex>
        <Button
          className="createButton"
          type="primary"
          icon={<img src={plus} className="smallIcon" />}
          onClick={() => navigate("/newTrip")}
        >
          Create a trip
        </Button>
      </Flex>
    </Header>
  );
}

export default standardHeader;
