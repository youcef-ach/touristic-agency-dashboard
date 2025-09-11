import { Flex, Typography } from "antd";
import StatCard from "./statCard";
import TripCard from "./tripCard";
import { useContext } from "react";
import { authCtx } from "../../App";

const { Text, Title } = Typography;

function dashboard() {
  const { logged } = useContext(authCtx);

  if (logged.admin)
    return (
      <Flex vertical justify="center" align="center" gap={24} wrap>
        <Flex
          justify="center"
          align="center"
          gap={24}
          wrap
          className="statFlex fullW"
        >
          <StatCard title="Total Users" number="12450" perc="12%" chart="up" />
          <StatCard title="Total Trips" number="3120" perc="2%" chart="down" />
          <StatCard title="Total Users" number="520" perc="2%" chart="up" />
        </Flex>
        <Title className="tripsHeader" level={2}>
          Trips
        </Title>
        <Flex justify="center" align="center" gap={24} wrap className="fullW">
          <TripCard />
        </Flex>
      </Flex>
    );
  else
    return (
      <Title level={2} style={{ textAlign: "center" }} type="danger">
        only admins can see this page
      </Title>
    );
}

export default dashboard;
