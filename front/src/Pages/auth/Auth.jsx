import { useContext, useRef } from "react";
import "./auth.css";
import { Carousel, Form, Input, Button, Typography, Flex, message } from "antd";
import logo from "../../assets/icons/logo.svg";
import { api } from "../../api/api";
import { useNavigate, Navigate } from "react-router-dom";
import { authCtx } from "../../App";
import { isLoggedIn } from "../../api/isLoggedIn";

const { Link, Title, Text } = Typography;

function Auth() {
  const carouselRef = useRef(null);
  const navigate = useNavigate();
  const { logged, setLogged } = useContext(authCtx);

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
        const data = isLoggedIn();
        setLogged({
          logged: data.logged,
          admin: data.admin,
          name: data.name,
          id: data.id,
        });
        message.success("success");
        navigate("/");
      }
    } catch (err) {
      console.log(err);
      message.error("error");
    }
  };

  const handleSignUp = async (values) => {
    try {
      const res = await api.post("registerUser/", {
        ...values,
        email: "contact@example.com",
      });
      if (res.data.message == "success") {
        message.success("success");
      }
    } catch (err) {
      message.error("error");
    }
  };
  if (logged.logged) return <Navigate to="/" />;
  else
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
                Sign in with Google to manage destinations, itineraries, and
                user activity with ease
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
                Sign in with Google to manage destinations, itineraries, and
                user activity with ease
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
                rules={[
                  { required: true, message: "required message" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("The two passwords do not match!")
                      );
                    },
                  }),
                ]}
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
