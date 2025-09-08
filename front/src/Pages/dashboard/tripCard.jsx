import { Card, Typography, Flex, Tag } from "antd";
import Sample1 from "../../assets/images/sample1.jpg";
import Sample2 from "../../assets/images/sample2.jpg";
import Sample3 from "../../assets/images/sample3.jpg";
import Sample4 from "../../assets/images/sample4.jpg";
import loc from "../../assets/icons/location-mark.svg";

const { Text, Title } = Typography;

const allTrips = [
  {
    id: 1,
    name: "Tropical Rewind",
    imageUrls: Sample1,
    itinerary: [{ location: "Thailand" }],
    tags: ["Adventure", "Culture"],
    travelStyle: "Solo",
    estimatedPrice: "$1,000",
  },
  {
    id: 2,
    name: "French Reverie",
    imageUrls: Sample2,
    itinerary: [{ location: "Paris" }],
    tags: ["Relaxation", "Culinary"],
    travelStyle: "Family",
    estimatedPrice: "$2,000",
  },
  {
    id: 3,
    name: "Zen Break",
    imageUrls: Sample3,
    itinerary: [{ location: "Japan" }],
    tags: ["Shopping", "Luxury"],
    travelStyle: "Couple",
    estimatedPrice: "$3,000",
  },
  {
    id: 4,
    name: "Adventure in Westeros",
    imageUrls: Sample4,
    itinerary: [{ location: "Croatia" }],
    tags: ["Historical", "Culture"],
    travelStyle: "Friends",
    estimatedPrice: "$4,000",
  },
];

function tripCard() {
  const tripCards = allTrips.map((item) => (
    <Card
      hoverable
      key={item.id}
      className="tripCard"
      cover={<img className="fullHW" src={item.imageUrls} />}
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
        {item.tags.map((item) => (
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
