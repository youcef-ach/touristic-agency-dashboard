import axios from "axios";
import { useContext, useRef, useState } from "react";
import { windowCtx } from "../../App";
import "./auth.css";
import { Carousel, Form, Input, Button, Typography, Flex, message } from "antd";
import logo from "../../assets/icons/logo.svg";
import { api } from "../../api/api";
import { useNavigate } from "react-router-dom";

const { Link, Title, Text } = Typography;

// function getCookie(name) {
//   var cookieValue = null;
//   if (document.cookie && document.cookie !== "") {
//     var cookies = document.cookie.split(";");
//     for (var i = 0; i < cookies.length; i++) {
//       var cookie = cookies[i].trim();
//       if (cookie.substring(0, name.length + 1) === name + "=") {
//         cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
//         break;
//       }
//     }
//   }
//   return cookieValue;
// }

function Auth() {
  const carouselRef = useRef(null);
  const redirect = useNavigate();
  const { winWidth } = useContext(windowCtx);

  const handleLogin = async (values) => {
    const body = {
      traveler_name: values["1traveler_name"],
      password: values["1password"],
    };
    try {
      const res = await api.post("api/token/", body);
      if (res.data.access && res.data.refresh) {
        localStorage.setItem("access-token", res.data.access);
        localStorage.setItem("refresh-token", res.data.refresh);
        message.success("success");
        redirect("/dashboard");
      }
    } catch (err) {
      console.log(err);
      message.error("error");
    }
  };

  const handleSignUp = async (values) => {
    const body = new FormData();
    body.append("traveler_name", values.traveler_name);
    body.append("password", values.password);
    body.append("password2", values.password2);
    try {
      const res = await api.post("registerUser/", body);
      if (res.data.message == "success") {
        message.success("success");
      }
      console.log(res.data);
    } catch (err) {
      console.log(err);
      message.error("error");
    }
  };

  return (
    <div className="authContainer">
      <div className="carouselContainer">
        <Carousel ref={carouselRef} className="myCarousel" infinite={false}>
          <Form
            layout="vertical"
            className="myForm"
            onFinish={handleLogin}
            onFinishFailed={() => message.error("error")}
          >
            <Flex
              justify="center"
              align="center"
              gap={6}
              className="authHeader"
            >
              <img src={logo} className="mediumIcon" />
              <Title level={1} className="noMP authTitle">
                Tourvisto
              </Title>
            </Flex>
            <Title level={2} className="authSubHeader">
              Admin Dashboard Login
            </Title>
            <Text className="authDesc" type="secondary">
              Sign in with Google to manage destinations, itineraries, and user
              activity with ease
            </Text>
            <Form.Item
              label="admin name"
              name="1traveler_name"
              rules={[{ required: true, message: "required message" }]}
            >
              <Input type="text" placeholder="admin name" />
            </Form.Item>
            <Form.Item
              label="password"
              name="1password"
              rules={[{ required: true, message: "required message" }]}
            >
              <Input.Password placeholder="password" />
            </Form.Item>
            <Form.Item className="authSubmit">
              <Button type="primary" block htmlType="submit">
                submit
              </Button>
            </Form.Item>
            <Link href="#" onClick={() => carouselRef.current.next()}>
              don t have an account? sign up for free
            </Link>
          </Form>
          <Form
            className="myForm"
            layout="vertical"
            onFinish={handleSignUp}
            onFinishFailed={() => message.error("error")}
          >
            <Flex
              justify="center"
              align="center"
              gap={6}
              className="authHeader"
            >
              <img src={logo} className="mediumIcon" />
              <Title level={1} className="noMP authTitle">
                Tourvisto
              </Title>
            </Flex>
            <Title level={2} className="authSubHeader">
              Admin Dashboard Login
            </Title>
            <Text className="authDesc" type="secondary">
              Sign in with Google to manage destinations, itineraries, and user
              activity with ease
            </Text>
            <Form.Item
              label="admin name"
              name="traveler_name"
              rules={[{ required: true, message: "required message" }]}
            >
              <Input type="text" placeholder="admin name" />
            </Form.Item>
            <Form.Item
              label="password"
              name="password"
              rules={[{ required: true, message: "required message" }]}
            >
              <Input.Password placeholder="password" />
            </Form.Item>
            <Form.Item
              label="confirm password"
              name="password2"
              rules={[{ required: true, message: "required message" }]}
            >
              <Input.Password placeholder="password" />
            </Form.Item>
            <Form.Item className="authSubmit">
              <Button type="primary" block htmlType="submit">
                submit
              </Button>
            </Form.Item>
            <Link href="#" onClick={() => carouselRef.current.prev()}>
              already have an account? sign in
            </Link>
          </Form>
        </Carousel>
      </div>
    </div>
  );
}

export default Auth;
