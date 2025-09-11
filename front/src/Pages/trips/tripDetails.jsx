import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { Flex, List, Rate, Tag, Typography } from "antd";
import "./tripDetails.css";
import calendar from "../../assets/icons/calendar.svg";
import location from "../../assets/icons/location-mark.svg";
import TripCard from "../dashboard/tripCard";

const { Title, Text } = Typography;

const tagColors = ["processing", "success", "warning", "magenta"];

function tripDetails() {
  const [data, setData] = useState(useLoaderData().details);
  const [popular, setPopular] = useState(useLoaderData().popularTrips.results);

  return (
    <Flex
      className="detailsContainer fullW"
      vertical
      justify="center"
      align="start"
      gap={36}
    >
      <Title className="tripName noMP" level={1}>
        {data.name}
      </Title>
      <Flex justify="start" align="center" className="fullW" gap={25}>
        <Flex justify="center" align="center" gap={6}>
          <img src={calendar} style={{ height: 20, width: 20 }} />
          <Title className="noMP calendar" level={3}>
            {data.duration} days plan
          </Title>
        </Flex>
        <Flex justify="center" align="center" gap={6}>
          <img src={location} style={{ height: 20, width: 20 }} />
          <Title level={3} className="noMP location">
            {[
              ...new Set(
                data.itinerary.flatMap((item) =>
                  item.location.split("&").map((loc) => loc.trim())
                )
              ),
            ]
              .slice(0, 3)
              .join(", ")}
          </Title>
        </Flex>
      </Flex>
      <Flex
        justify="center"
        align="center"
        className="fullW imagesFlex"
        gap={20}
        wrap
      >
        <div className="mainImgContainer fullH">
          <img className="fullHW" src={data.images[0].image_url} />
        </div>
        <Flex
          gap={14}
          vertical
          justify="center"
          align="center"
          className="secImgFlex fullH"
        >
          <div className="secImgContainer fullW">
            <img className="fullHW" src={data.images[1].image_url} />
          </div>
          <div className="secImgContainer fullW">
            <img className="fullHW" src={data.images[2].image_url} />
          </div>
        </Flex>
      </Flex>
      <Flex justify="space-between" align="center" className="fullW">
        <Flex justify="start" align="center" gap={20}>
          {data.interests.split(",").map((item, index) => (
            <Tag
              className="tag"
              bordered={false}
              key={index}
              color={tagColors[index]}
            >
              {item}
            </Tag>
          ))}
        </Flex>
        <Rate defaultValue={3.5} allowHalf></Rate>
      </Flex>
      <Flex vertical gap={16} justify="center" align="center" className="fullW">
        <Flex justify="space-between" align="center" className="fullW">
          <Title className="noMP sName" level={3}>
            {data.duration} days {data.country} program
          </Title>
          <Title className="noMP dPrice" level={4}>
            {data.estimated_price}
          </Title>
        </Flex>
        <Flex justify="start" align="center" className="fullW">
          {data.interests.split(",").map((item, index) => (
            <Text className="sDesc" type="secondary" key={index}>
              {item}
            </Text>
          ))}
        </Flex>
      </Flex>
      <Text className="desc">{data.description}</Text>
      <List
        dataSource={data.itinerary}
        renderItem={(item) => (
          <List
            className="innerList"
            dataSource={item.activities}
            header={
              <Text className="listTitle">{"Day " + item.day + ":"}</Text>
            }
            renderItem={(item) => (
              <List.Item>
                <Flex
                  justify="start"
                  align="center"
                  gap={10}
                  className="listItemFlex"
                >
                  <Text className="disc">•</Text>
                  <Text className="listItem">{item.description}</Text>
                </Flex>
              </List.Item>
            )}
          ></List>
        )}
      ></List>
      <List
        dataSource={data.best_time_to_visit}
        renderItem={(item) => (
          <List.Item>
            <Flex
              justify="start"
              align="center"
              gap={10}
              className="listItemFlex"
            >
              <Text className="listItem disc">•</Text>
              <Text className="listItem"> {item}</Text>
            </Flex>
          </List.Item>
        )}
        header={<Text className="listTitle">Best Time to Visit</Text>}
      ></List>
      <List
        dataSource={data.weather_info}
        renderItem={(item) => (
          <List.Item>
            {" "}
            <Flex
              justify="start"
              align="center"
              gap={10}
              className="listItemFlex"
            >
              <Text className="disc">•</Text>
              <Text className="listItem">{item}</Text>
            </Flex>
          </List.Item>
        )}
        header={<Text className="listTitle">Weather Info</Text>}
      ></List>
      <Flex
        justify="center"
        align="center"
        wrap
        gap={24}
        className="fullW popularFlex"
      >
        <TripCard trips={popular} />
      </Flex>
    </Flex>
  );
}

export default tripDetails;