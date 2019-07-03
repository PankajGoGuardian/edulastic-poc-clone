import { signUpState } from "@edulastic/constants";
import { isUndefined, isEmpty } from "lodash";
import { Partners } from "./static/partnerData";

export const getWordsInURLPathName = pathname => {
  let path = pathname;
  path = path + "";
  path = path.split("/");
  path = path.filter(item => (item && item.trim() ? true : false));
  return path;
};

export const isLoggedInForPrivateRoute = user => {
  if (user && user.isAuthenticated) {
    if (user && user.user && !user.user.role && (user.user.googleId || user.user.msoId || user.user.cleverId)) {
      return false;
    }
    if (user && user.user && user.user.role !== "teacher") {
      return true;
    } else if (
      user.user &&
      user.user.role === "teacher" &&
      (user.signupStatus === signUpState.DONE || isUndefined(user.signupStatus))
    ) {
      return true;
    }
  }
  return false;
};

export const isLoggedInForLoggedOutRoute = user => {
  if (user && user.isAuthenticated) {
    if (user && user.user && !user.user.role && (user.user.googleId || user.user.msoId || user.user.cleverId)) {
      return true;
    }
    if (user && user.user && user.user.role !== "teacher") {
      return true;
    } else if (
      user.user &&
      user.user.role === "teacher" &&
      (user.signupStatus === signUpState.DONE || isUndefined(user.signupStatus))
    ) {
      return true;
    }
  }
  return false;
};

export const validatePartnerUrl = partner => {
  const pathname = location.pathname;
  if (
    partner.keyName !== "login" &&
    pathname.toLocaleLowerCase().includes("partnerlogin") &&
    pathname.toLocaleLowerCase().includes(partner.keyName.toLocaleLowerCase())
  ) {
    return true;
  } else if (partner.keyName === "login" && !pathname.toLocaleLowerCase().includes("partnerlogin")) {
    return true;
  }
  return false;
};

export const getPartnerLoginUrl = partner => {
  if (partner.keyName === "login") {
    return `/login`;
  } else {
    return `/partnerLogin/${partner.keyName}/`;
  }
};

export const getPartnerTeacherSignupUrl = partner => {
  if (partner.keyName === "login") {
    return `/signup`;
  } else {
    return `/partnerLogin/${partner.keyName}/signup`;
  }
};

export const getPartnerStudentSignupUrl = partner => {
  if (partner.keyName === "login") {
    return `/studentsignup`;
  } else {
    return `/partnerLogin/${partner.keyName}/studentsignup`;
  }
};

export const getPartnerDASignupUrl = partner => {
  if (partner.keyName === "login") {
    return `/adminsignup`;
  } else {
    return `/partnerLogin/${partner.keyName}/adminsignup`;
  }
};

export const getPartnerGetStartedUrl = partner => {
  if (partner.keyName === "login") {
    return `/getStarted`;
  } else {
    return `/partnerLogin/${partner.keyName}/getStarted/`;
  }
};

export const getPartnerKeyFromUrl = pathname => {
  const pathArr = pathname.split("/");
  let partnersArr = Object.keys(Partners);
  let tempPartner = pathArr[partnersArr.length - 1];
  const foundPartner = partnersArr.find(item => item === tempPartner);
  if (foundPartner) {
    return foundPartner;
  }
  return "login";
};

export const getDistrictLoginUrl = districtShortName => {
  return `/district/${districtShortName}`;
};

export const getDistrictTeacherSignupUrl = districtShortName => {
  return `/district/${districtShortName}/signup`;
};

export const getDistrictStudentSignupUrl = districtShortName => {
  return `/district/${districtShortName}/studentsignup`;
};

export const getDistrictGetStartedUrl = districtShortName => {
  return `/district/${districtShortName}/getstarted`;
};

export const isDistrictPolicyAllowed = (isSignupUsingDaURL, districtPolicy, name) => {
  if (isSignupUsingDaURL && districtPolicy && (districtPolicy[name] || isUndefined(districtPolicy[name]))) {
    return true;
  }
  return false;
};

export const isDistrictPolicyAvailable = (isSignupUsingDaURL, districtPolicy) =>
  isSignupUsingDaURL && typeof districtPolicy === "object";
