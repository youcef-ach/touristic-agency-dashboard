import { Button, Flex, Typography } from "antd";
import { Header } from "antd/es/layout/layout";
import "./home.css";
import plus from "../../assets/icons/plus.svg";
const {Text} = Typography

function standardHeader() {
  return (
    <Header className="standardHeader">
      <Flex
        className="helloFlex"
        justify="space-between"
        align="center"
        wrap
        gap={40}
      >
        <Flex className="helloSubFlex" vertical justify="center" align="center">
          <Text className="hello">Welcome Adrian👋</Text>
          <Text className="helloDesc">
            Track activity, trends, and popular destinations in real time
          </Text>
        </Flex>
        <Button
          className="createButton"
          type="primary"
          icon={<img src={plus} className="smallIcon" />}
        >
          Create a trip
        </Button>
      </Flex>
    </Header>
  );
}

export default standardHeader;