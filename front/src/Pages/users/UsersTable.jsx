import { useLoaderData } from "react-router-dom";
import "./UsersTable.css";
import { Table, Tag, Typography, Flex } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useState, useMemo, useRef } from "react";
import { secureApi } from "../../api/api.js";

const { Text, Title } = Typography;

function UsersTable() {
  const [data, setData] = useState(useLoaderData().data.results);
  const [loading, setLoading] = useState(false);
  const page = useRef(useLoaderData().page);
  const count = useRef(useLoaderData().data.count);

  const dataSrc = data.map((item) => ({
    key: item.id,
    name: item.traveler_name,
    status: item.is_superuser
      ? "admin"
      : item.is_active
      ? "active user"
      : "inactive user",
    date_joined: item.date_joined,
  }));

  const handleChange = async ({ current }) => {
    setLoading(true);
    try {
      const res = await secureApi.get("users/?page=" + current);
      page.current = current;
      setData(res.data.results);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        title: "id",
        dataIndex: "key",
        key: "id",
      },
      {
        title: "names",
        dataIndex: "name",
        key: "names",
        render: (name) => (
          <Flex justify="start" align="center" gap={12}>
            <div className="img"></div>
            <Text className="name">{name}</Text>
          </Flex>
        ),
      },
      {
        title: "date joined",
        dataIndex: "date_joined",
        key: "dates",
        render: (data) => <Text>{new Date(data).toDateString()}</Text>,
      },
      {
        title: "status",
        dataIndex: "status",
        key: "statuses",
        render: (text) => {
          return text == "admin" ? (
            <Tag className="greenTag">{text}</Tag>
          ) : (
            <Tag className="blackTag">{text}</Tag>
          );
        },
      },
      {
        title: "",
        dataIndex: "key",
        render: (id) => <DeleteOutlined className="delete" />,
      },
    ],
    []
  );

  return (
    <div className="tableContainer fullHW">
      <Table
        bordered
        title={() => <Title level={3}>All users</Title>}
        style={{ minWidth: 500 }}
        loading={loading}
        dataSource={dataSrc}
        columns={columns}
        pagination={{
          total: count.current,
          current: page.current,
          pageSize: 10,
        }}
        onChange={handleChange}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
}

export default UsersTable;
