import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import posthog from "posthog-js";
import "./index.css";
import App from "./App";

posthog.init(process.env.REACT_APP_PUBLIC_POSTHOG_TOKEN as string, {
  api_host: process.env.REACT_APP_PUBLIC_POSTHOG_HOST,
  defaults: "2026-01-30",
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
