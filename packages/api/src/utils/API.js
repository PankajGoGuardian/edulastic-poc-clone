import axios from "axios";
import { storeInLocalStorage, getFromLocalStorage } from "@edulastic/api/src/utils/Storage";
import config from "../config";
import { getAccessToken, getTraceId, initKID, initTID } from "./Storage";

const ASSETS_REFRESH_STAMP = "assetsRefreshDateStamp";

const getCurrentPath = () => {
  const location = window.location;
  return `${location.pathname}${location.search}${location.hash}`;
};

const getWordsInURLPathName = pathname => {
  // When u try to change this function change the duplicate function in "src/client/common/utils/helpers.js" also
  let path = pathname;
  path += "";
  path = path.split("/");
  path = path.filter(item => item);
  return path;
};

const getLoggedOutUrl = () => {
  // When u try to change this function change the duplicate function in "src/client/student/Login/ducks.js" also
  const path = getWordsInURLPathName(window.location.pathname);
  const pathname = window.location.pathname.toLocaleLowerCase();
  if (pathname === "/getstarted") {
    return "/getStarted";
  }
  if (pathname === "/signup") {
    return "/signup";
  }
  if (pathname === "/studentsignup") {
    return "/studentsignup";
  }
  if (pathname === "/adminsignup") {
    return "/adminsignup";
  }
  if (path[0] && path[0].toLocaleLowerCase() === "district" && path[1]) {
    const arr = [...path];
    arr.shift();
    const restOfPath = arr.join("/");
    return `/district/${restOfPath}`;
  }
  if (pathname === "/resetpassword") {
    return window.location.href.split(window.location.origin)[1];
  }
  if (pathname === "/inviteteacher") {
    return `${window.location.pathname}${window.location.search}${window.location.hash}`;
  }

  return "/login";
};

function getParentsStudentToken(_config) {
  try {
    if (_config.method !== "get") {
      return false;
    }

    if (["/user/me", "/logout", "/login", "/signUp", "/user/parent-code"].find(x => _config.url?.includes(x))) {
      return false;
    }
    const currentUserFromRedux = window?.getStore()?.getState()?.user || {};
    const { currentChild } = currentUserFromRedux;
    const { role: userRole, children } = currentUserFromRedux?.user || {};
    if (userRole === "parent" && currentChild && children?.length > 0) {
      return children.find(child => child._id === currentChild)?.token;
    }
  } catch (e) {
    console.warn("error parentSstudent", e);
  }
}

/**
 * A helper to check if the date object is a a valid one
 * @param {Date} d
 *
 */
const isValidDate = d => d instanceof Date && Number.isFinite(Number(d));

/**
 * A helper to get difference in ms for dates
 */
const diffInSeconds = (dt2, dt1) => (dt2.getTime() - dt1.getTime()) / 1000;

/** A small function to compare semver versions
 * TODO: Move this into utils, if needed at multiple places
 */
const SemverCompare = (a, b) => {
  const pa = a.split(".");
  const pb = b.split(".");
  for (let i = 0; i < 3; i++) {
    const na = Number(pa[i]);
    const nb = Number(pb[i]);
    if (na > nb) return 1;
    if (nb > na) return -1;
    if (!Number.isNaN(na) && Number.isNaN(nb)) return 1;
    if (Number.isNaN(na) && !Number.isNaN(nb)) return -1;
  }
  return 0;
};

export default class API {
  constructor(baseURL = config.api, defaultToken = false) {
    this.baseURL = baseURL;

    this.instance = axios.create({
      baseURL: this.baseURL,
      headers: {
        "Content-Type": "application/json"
      }
    });
    this.instance.interceptors.request.use(_config => {
      const token = getParentsStudentToken(_config) || defaultToken || getAccessToken();
      if (token) {
        _config.headers.Authorization = token;
      }
      // Initialise browser tab id
      initTID();
      // Initialise kid for unauthenticated user
      initKID();
      if (window.sessionStorage) {
        _config.headers["X-Amzn-Trace-Id"] = getTraceId();
      }
      return _config;
    });
    this.instance.interceptors.response.use(
      response => {
        const appVersion = process.env.__CLIENT_VERSION__ || "NA";
        const serverAppVersion = response.headers["server-version"] || "";

        // if the server version is higher than the client version, then try to resync
        if (appVersion && serverAppVersion && SemverCompare(serverAppVersion, appVersion) === 1) {
          const lastAssetRefresh = new Date(parseInt(getFromLocalStorage(ASSETS_REFRESH_STAMP), 10));
          const currentDate = new Date();
          const lastRefreshDate = isValidDate(lastAssetRefresh) ? lastAssetRefresh : currentDate;
          const diffInSec = diffInSeconds(currentDate, lastRefreshDate);

          // retry only if 15 minutes are passed or there was no time stamp stored.
          if (diffInSec > 0 && diffInSec < 45 * 60) return response;

          storeInLocalStorage(ASSETS_REFRESH_STAMP, new Date().getTime());

          console.warn("++++ App Version Mismatch +++");
          console.warn(`++++ Server: ${serverAppVersion}  Client: ${serverAppVersion}  +++`);

          const event = new Event("request-client-update");
          window.dispatchEvent(event);
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
            if (!window.location.pathname.toLocaleLowerCase().includes(getLoggedOutUrl())) {
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
