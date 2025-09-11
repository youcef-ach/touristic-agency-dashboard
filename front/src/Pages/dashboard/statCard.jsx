import { Card, Flex, Typography } from "antd";
import up from "../../assets/icons/arrow-up-green.svg";
import "./dashboard.css";
import upChart from "../../assets/icons/increment.svg";
import downChart from "../../assets/icons/decrement.svg";

const { Text } = Typography;

function statCard({ title, number, perc, chart, styleIndex }) {
  return (
    <Card
      hoverable
      className="statCard"
      title={<Text className="cardTitle">{title}</Text>}
    >
      <Flex justify="center" align="center" gap={16}>
        <Flex vertical justify="center" align="start" gap={16}>
          <Text className="headNumber">{number}</Text>
          <Flex justify="center" align="center" gap={8}>
            <img src={up} className="smallIcon" />
            <Text type="success" className="success">
              {perc}
            </Text>
            <Text type="secondary" className="vsmonth">
              vs last month
            </Text>
          </Flex>
        </Flex>
        <div className="chart">
          {chart == "up" ? <img src={upChart} /> : <img src={downChart} />}
        </div>
      </Flex>
    </Card>
  );
}

export default statCard;
