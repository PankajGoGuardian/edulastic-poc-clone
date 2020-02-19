//@ts-check
import axios from "axios";
import config from "../config";
import { getAccessToken, getTraceId, initKID, initTID } from "./Storage";
import AppDetails from "appDetails";
import semverCompare from "semver-compare";
//import { getStore } from 'reduxStore';
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
  const pathname = window.location.pathname.toLocaleLowerCase();
  if (pathname === "/getstarted") {
    return "/getStarted";
  } else if (pathname === "/signup") {
    return "/signup";
  } else if (pathname === "/studentsignup") {
    return "/studentsignup";
  } else if (pathname === "/adminsignup") {
    return "/adminsignup";
  } else if (path[0] && path[0].toLocaleLowerCase() === "district" && path[1]) {
    let arr = [...path];
    arr.shift();
    let restOfPath = arr.join("/");
    return "/district/" + restOfPath;
  } else if (pathname === "/resetpassword") {
    return window.location.href.split(window.location.origin)[1];
  } else if (pathname === "/inviteteacher") {
    return `${location.pathname}${location.search}${location.hash}`;
  } else {
    return "/login";
  }
};

function getParentsStudentToken(config) {
  console.log('config url', { url: config.url });
  try {
    if (['/user/me', '/logout', '/login', '/signUp'].find(x => config.url ?.includes(x))) {
      return false;
    }
    const currentUserFromRedux = window ?.getStore() ?.getState() ?.user || {};
    const { currentChild } = currentUserFromRedux;
    const { role: userRole, children } = currentUserFromRedux ?.user || {};
    if (userRole === "parent" && currentChild && children ?.length > 0) {
      return children.find(child => child._id === currentChild) ?.token;
    }
  } catch (e) {
    console.warn('error parentSstudent', e);
  }
}

export default class API {
  constructor(baseURL = config.api, defaultToken = false) {
    this.baseURL = baseURL;

    this.instance = axios.create({
      baseURL: this.baseURL,
      headers: {
        "Content-Type": "application/json"
      }
    });
    this.instance.interceptors.request.use(config => {
      let token = getParentsStudentToken(config) || defaultToken || getAccessToken();
      //let token = defaultToken || getAccessToken();
      if (token) {
        config.headers["Authorization"] = token;
      }
      // Initialise browser tab id
      initTID();
      // Initialise kid for unauthenticated user
      initKID();
      if (window.sessionStorage) {
        config.headers["X-Amzn-Trace-Id"] = getTraceId();
      }
      return config;
    });
    this.instance.interceptors.response.use(
      response => {
        // has support since IE8.
        if (window.sessionStorage) {
          // if appVersion sent recieved from api is greater than in the client, then dispatch an event.
          const appVersion = AppDetails ?.version;
          const apiAppVersion = response.headers["app-version"] || "";
          const refreshRequested = window.sessionStorage["refreshRequested"];
          if (semverCompare(apiAppVersion, appVersion) == 1 && !refreshRequested && apiAppVersion) {
            const event = new Event("request-client-update");
            window.dispatchEvent(event);
            window.sessionStorage["refreshRequested"] = true;
          }
        }
        return response;
      },
      data => {
        if (data && data.response && data.response.status) {
          if (data.response.status === 401) {
            // Needs proper fixing, patching it to fix infinite reload
            const loginRedirectUrl = localStorage.getItem("loginRedirectUrl");
            localStorage.clear();
            localStorage.setItem("loginRedirectUrl", loginRedirectUrl);
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
