import { signUpState } from "@edulastic/constants";
import { isUndefined, isEmpty, trim } from "lodash";
import { Partners } from "./static/partnerData";

export const getWordsInURLPathName = pathname => {
  // When u try to change this function change the duplicate function in "packages/api/src/utils/API.js" also
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

export const getPartnerLoginUrl = partner =>
  partner.keyName === "login" ? `/login` : `/partnerLogin/${partner.keyName}/`;

export const getPartnerTeacherSignupUrl = partner =>
  partner.keyName === "login" ? `/signup` : `/partnerLogin/${partner.keyName}/signup`;

export const getPartnerStudentSignupUrl = partner =>
  partner.keyName === "login" ? `/studentsignup` : `/partnerLogin/${partner.keyName}/studentsignup`;

export const getPartnerDASignupUrl = partner =>
  partner.keyName === "login" ? `/adminsignup` : `/partnerLogin/${partner.keyName}/adminsignup`;

export const getPartnerGetStartedUrl = partner =>
  partner.keyName === "login" ? `/getStarted` : `/partnerLogin/${partner.keyName}/getStarted/`;

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

export const emailSpecialCharCheck = (rule, value, callback, message) => {
  const emailRegExp = new RegExp(
    "^[_A-Za-z0-9-'\\+]+(\\.[_A-Za-z0-9-']+)*@[A-Za-z0-9]+([A-Za-z0-9\\-\\.]+)*(\\.[A-Za-z]{1,25})$"
  );
  const userNameRegExp = new RegExp("^[A-Za-z0-9@._ -']+$");

  if (emailRegExp.test(value.trim()) || userNameRegExp.test(value.trim())) {
    callback();
  } else {
    callback(message);
  }
};
