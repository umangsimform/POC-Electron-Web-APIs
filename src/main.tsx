import React from "react";
import ReduxProvider from "./store/redux-provider";
import { RouterProvider } from "react-router-dom";
import ReactDOM from "react-dom/client";
import "./samples/node-api";
import "./index.scss";
import router from "./routes/routes";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ReduxProvider>
      <RouterProvider router={router} />
    </ReduxProvider>
  </React.StrictMode>
);

postMessage({ payload: "removeLoading" }, "*");
