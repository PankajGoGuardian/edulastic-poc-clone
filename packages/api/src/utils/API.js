//@ts-check
import axios from "axios";
import { message } from "antd";
import config from "../config";
import { getAccessToken } from "./Storage";

const getCurrentPath = () => {
  const location = window.location;
  return `${location.pathname}${location.search}${location.hash}`;
};

export default class API {
  constructor(baseURL = config.api) {
    this.baseURL = baseURL;

    this.instance = axios.create({
      baseURL: this.baseURL,
      headers: {
        "Content-Type": "application/json"
      }
    });
    this.instance.interceptors.request.use(config => {
      let token = getAccessToken();
      if (token) {
        config.headers["Authorization"] = token;
      }
      return config;
    });
    this.instance.interceptors.response.use(
      response => response,
      data => {
        if (data && data.response && data.response.status) {
          if (data.response.status === 401) {
            window.localStorage.setItem("loginRedirectUrl", getCurrentPath());
            localStorage.clear();
            window.location.href = "/login";
          }
        }
        return Promise.reject(data.response);
      }
    );
  }

  callApi({ method = "get", ...rest }) {
    return this.instance({ method, ...rest });
  }
}
