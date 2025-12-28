/// <reference types="vite/client" />

import axios from "axios";
const requestMap = new Map();
const CancelToken = axios.CancelToken;

const getUrl = () => {
  if (window?.location?.origin?.includes("localhost")) {
    return import.meta.env.VITE_APP_LOCAL_URL;
  } else if (window?.location?.origin?.includes("dev.api.backend.com")) {
    return import.meta.env.VITE_APP_DEV_URL;
  } else if (window?.location?.origin?.includes("stage.api.backend.com")) {
    return import.meta.env.VITE_APP_STAGE_URL;
  } else if (window?.location?.origin?.includes("api.backend.com")) {
    return import.meta.env.VITE_APP_PROD_URL;
  }
};

console.log("getUrl", getUrl());
const axiosApi = axios.create({
  baseURL: getUrl(),
});
export const axiosInstance = axiosApi;

axiosInstance.interceptors.request.use(
  (config) => {
    const requestKey = `${config.method}-${config.url}-${JSON.stringify(
      config.params
    )}-${JSON.stringify(config.data)}`;

    if (requestMap.has(requestKey)) {
      requestMap
        .get(requestKey)
        .cancel("Operation canceled due to new request.");
    }

    config.headers.Authorization = "Bearer your_token";
    config.headers["Content-Security-Policy"] = "*";
    config.headers["Access-Control-Allow-Origin"] = "*";
    config.headers["X-Content-Type-Options"] = "nosniff";
    config.headers["Access-Control-Allow-Methods"] = "*";
    config.headers["Access-Control-Allow-Headers"] = "*";
    config.headers["Content-Type"] = "application/json";
    config.headers["X-Frame-Options"] = "SAMEORIGIN";
    config.headers["ngrok-skip-browser-warning"] = true;
    config.cancelToken = new CancelToken(function executor(c) {
      requestMap.set(requestKey, { cancel: c });
    });
    return config;
  },
  (error) => {
    if (axios.isCancel(error)) {
      console.log("Request canceled", error.message);
    } else {
      return Promise.reject(error);
    }
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    console.log("Response:", response);
    const requestKey = `${response.config.method}-${
      response.config.url
    }-${JSON.stringify(response.config.params)}-${JSON.stringify(
      response.config.data
    )}`;
    requestMap.delete(requestKey);
    return response;
  },
  (error) => {
    console.log("Error response:", error);

    if (axios.isCancel(error)) {
      console.log("Request canceled", error.message);
    } else {
      if (error.response && error.response.status === 401) {
        // console.log('Unauthorized, redirecting to login...');
        // localStorage.clear();
        // sessionStorage.clear();
        // window.location.href = '/login';
        // window.location.reload();
      }
      return Promise.reject(error);
    }
  }
);
