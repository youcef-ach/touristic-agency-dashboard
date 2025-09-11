import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const api = axios.create({
  baseURL: "http://localhost:8000/",
});

export const secureApi = axios.create({
  baseURL: "http://localhost:8000/",
});

const authInterceptor = async (config) => {
  try {
    if (localStorage.getItem("access-token")) {
      const token = localStorage.getItem("access-token");
      if (jwtDecode(token).exp < Math.floor(Date.now() / 1000)) {
        console.log("expired");
        if (localStorage.getItem("refresh-token")) {
          const result = await api.post("api/token/refresh/", {
            refresh: localStorage.getItem("refresh-token"),
          });
          localStorage.setItem("access-token", result.data.access);
          config.headers.Authorization = `Bearer ${result.data.access}`;
        } else throw new Error("no refresh");
      } else
        config.headers.Authorization = `Bearer ${localStorage.getItem(
          "access-token"
        )}`;
    } else throw new Error("no access");
    return config;
  } catch (err) {
    throw err;
  }
};

secureApi.interceptors.request.use(authInterceptor);
