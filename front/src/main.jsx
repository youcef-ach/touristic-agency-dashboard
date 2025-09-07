import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "antd/dist/reset.css";
import App from "./App.jsx";
import { registerLicense } from "@syncfusion/ej2-base";

registerLicense(import.meta.env["VITE_EJ@LISCENCE"]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
