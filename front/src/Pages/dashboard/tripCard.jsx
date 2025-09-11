import { Card, Typography, Flex, Tag } from "antd";
import loc from "../../assets/icons/location-mark.svg";
import { useNavigate } from "react-router-dom";

const { Text, Title } = Typography;

function tripCard({ trips }) {
  const navigate = useNavigate();

  const tripCards = trips.map((item) => (
    <Card
      onClick={() => navigate("/tripDetails/" + item.id)}
      hoverable
      key={item.id}
      className="tripCard"
      cover={
        <img
          className="fullHW"
          src={item.images[0].image_url}
          style={{ objectFit: "cover" }}
        />
      }
    >
      <Card.Meta
        title={<Text className="tripTitle">{item.name}</Text>}
        description={
          <Flex justify="start" align="center" gap={6}>
            <img src={loc} className="vSmallIcon" />
            <Text className="tripDesc" type="secondary">
              {item.itinerary[0].location}
            </Text>
          </Flex>
        }
      />
      <Flex
        className="fullW tagsContainer"
        justify="start"
        align="center"
        gap={6}
      >
        {item.interests.split(",").map((item) => (
          <Tag key={item} color="purple">
            {item}
          </Tag>
        ))}
      </Flex>
      <div className="price">
        <Text>{item.estimatedPrice}</Text>
      </div>
    </Card>
  ));

  return <> {tripCards}</>;
}

export default tripCard;
