import { signUpState } from "@edulastic/constants";
import { isUndefined, isEmpty } from "lodash";

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

export const isDistrictPolicyAvailable = (isSignupUsingDaURL, districtPolicy) => {
  if (isSignupUsingDaURL && districtPolicy && !isEmpty(districtPolicy)) {
    return true;
  }
  return false;
};
