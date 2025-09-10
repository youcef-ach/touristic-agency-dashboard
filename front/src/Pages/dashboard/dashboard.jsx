import { Flex, Typography } from "antd";
import StatCard from "./statCard";
import TripCard from "./tripCard";

const { Text, Title } = Typography;

function dashboard() {
  return (
    <Flex vertical justify="center" align="center" gap={24}>
      <Flex justify="center" align="center" gap={24} wrap className="fullW">
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
}

export default dashboard;