import { Flex, Typography } from "antd";
import StatCard from "./statCard";
import TripCard from "./tripCard";
import { useContext, useState } from "react";
import { authCtx } from "../../App";
import { useLoaderData } from "react-router-dom";

const { Text, Title } = Typography;

function dashboard() {
  const { logged } = useContext(authCtx);
  const [trips, setTrips] = useState(useLoaderData().results);

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
        <TripCard trips={trips} />
      </Flex>
    </Flex>
  );
}

export default dashboard;