import { Card, Flex, Typography } from "antd";

const { Text } = Typography;

function statCard() {
  return (
    <Card title={<Text className="cardTitle">Total Users</Text>}>
      <Flex justify="center" align="center">
        <Flex>
          <Text>12450</Text>
          <Flex className="">
            <img src={up} className="smallIcon" />
            <Text type="success">12%</Text>
            <Text type="secondary">vs last month</Text>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
}

export default statCard;