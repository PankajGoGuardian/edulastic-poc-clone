//@ts-check
import axios from "axios";
import { message } from "antd";
import config from "../config";
import { getAccessToken } from "./Storage";

const getCurrentPath = () => {
  const location = window.location;
  return `${location.pathname}${location.search}${location.hash}`;
};

const getWordsInURLPathName = pathname => {
  // When u try to change this function change the duplicate function in "src/client/common/utils/helpers.js" also
  let path = pathname;
  path = path + "";
  path = path.split("/");
  path = path.filter(item => (item && item.trim() ? true : false));
  return path;
};

const getLoggedOutUrl = () => {
  // When u try to change this function change the duplicate function in "src/client/student/Login/ducks.js" also
  const path = getWordsInURLPathName(window.location.pathname);
  if (window.location.pathname.toLocaleLowerCase() === "/getstarted") {
    return "/getStarted";
  } else if (window.location.pathname.toLocaleLowerCase() === "/signup") {
    return "/signup";
  } else if (window.location.pathname.toLocaleLowerCase() === "/studentsignup") {
    return "/studentsignup";
  } else if (window.location.pathname.toLocaleLowerCase() === "/adminsignup") {
    return "/adminsignup";
  } else if (path[0] && path[0].toLocaleLowerCase() === "district" && path[1]) {
    let arr = [...path];
    arr.shift();
    let restOfPath = arr.join("/");
    return "/district/" + restOfPath;
  } else {
    return "/login";
  }
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
            localStorage.clear();
            if (!location.pathname.toLocaleLowerCase().includes(getLoggedOutUrl())) {
              localStorage.setItem("loginRedirectUrl", getCurrentPath());
            }
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
