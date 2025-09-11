import {
  Flex,
  Form,
  Select,
  DatePicker,
  InputNumber,
  Button,
  message,
} from "antd";
import "./newTrip.css";
import ai from "../../assets/icons/magic-star.svg";
import { action } from "./CreateNewTrip";
import { useState } from "react";

const { RangePicker } = DatePicker;

const countries = [
  { label: "United States", value: "United States" },
  { label: "Canada", value: "Canada" },
  { label: "Mexico", value: "Mexico" },
  { label: "France", value: "France" },
  { label: "Germany", value: "Germany" },
  { label: "Italy", value: "Italy" },
  { label: "Spain", value: "Spain" },
  { label: "Japan", value: "Japan" },
  { label: "China", value: "China" },
  { label: "Brazil", value: "Brazil" },
];

const groupTypes = [
  { label: "friends", value: "friends" },
  { label: "family", value: "family" },
  { label: "couple", value: "couple" },
];

const travelStyles = [
  { label: "hicking", value: "hicking" },
  { label: "camping", value: "camping" },
  { label: "luxury", value: "luxury" },
];

const interests = [
  { label: "adventure", value: "adventure" },
  { label: "relaxation", value: "relaxation" },
  { label: "culture", value: "culture" },
];

function newTrip() {
  const [loading, setLoading] = useState(false);

  return (
    <Flex justify="center" className="fullHW">
      <Form
        onFinish={async (values) => {
          setLoading(true);
          try {
            await action(values);
            message.success("created successfully");
          } catch (err) {
            message.error("try again");
          }
          setLoading(false);
        }}
        className="newTform"
        layout="vertical"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        <Form.Item
          name="country"
          label="countries"
          rules={[{ required: true, message: "required" }]}
        >
          <Select
            showSearch
            placeholder="pick coutries"
            options={countries}
          ></Select>
        </Form.Item>
        <Form.Item
          name="Duration"
          label="Duration"
          rules={[{ required: true, message: "required" }]}
        >
          <InputNumber
            className="input"
            max={100}
            min={1}
            suffix="days"
            controls
            placeholder="enter a number of days"
          />
        </Form.Item>
        <Form.Item name="period" label="Date">
          <RangePicker className="input" showTime></RangePicker>
        </Form.Item>
        <Form.Item
          name="Gtype"
          label="Group type"
          rules={[{ required: true, message: "required" }]}
        >
          <Select options={groupTypes} placeholder="select a group type" />
        </Form.Item>
        <Form.Item
          name="Tstyle"
          label="Travel style"
          rules={[{ required: true, message: "required" }]}
        >
          <Select
            options={travelStyles}
            placeholder="select your travel style"
          />
        </Form.Item>
        <Form.Item
          name="interests"
          label="interests"
          rules={[{ required: true, message: "required" }]}
        >
          <Select options={interests} placeholder="select your interests" />
        </Form.Item>
        <Form.Item
          name="budget"
          label="Budget estimate"
          rules={[{ required: true, message: "required" }]}
        >
          <InputNumber
            className="input"
            placeholder="select your budget preference"
            suffix="$"
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            block
            htmlType="submit"
            icon={<img src={ai} className="aiIcon" />}
            style={{ height: 48 }}
            loading={loading}
          >
            Generate a trip
          </Button>
        </Form.Item>
      </Form>
    </Flex>
  );
}

export default newTrip;