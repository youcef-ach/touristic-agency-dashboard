import { useState, useRef } from "react";
import TripCard from "../dashboard/tripCard";
import { useLoaderData } from "react-router-dom";
import { Flex, Pagination, Spin } from "antd";
import { secureApi } from "../../api/api";

function AllTrips() {
  const [data, setDate] = useState(useLoaderData().trips);
  const [loading, setLoading] = useState(false);
  const count = useRef(useLoaderData().count);
  const current = useRef(1);

  const handleChange = async (next) => {
    setLoading(true);
    try {
      const res = await secureApi.get("trips/all/?page_size=4&page=" + next);
      setDate(res.data.results);
      count.current = res.data.count;
      current.current = next;
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <>
      <Flex justify="center" align="center" gap={24} wrap className="fullW" style={{marginTop:10}}>
        <TripCard trips={data} />
      </Flex>
      <Flex
        className="fullW"
        justify="end"
        align="center"
        style={{ marginTop: 24 }}
      >
        {loading ? <Spin /> : null}
        <Pagination
          className="noMP"
          defaultCurrent={1}
          current={current.current}
          total={count.current}
          pageSize={4}
          align="right"
          onChange={handleChange}
        />
      </Flex>
    </>
  );
}

export default AllTrips;