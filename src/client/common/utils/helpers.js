import React from "react";
import styled from "styled-components";
import { isUndefined, last, get, isEmpty } from "lodash";
import { Tooltip as AntDTooltip, Modal } from "antd";
import { notification } from "@edulastic/common";
import { themeColor } from "@edulastic/colors";
import { signUpState, test as testConst } from "@edulastic/constants";
import { Partners } from "./static/partnerData";
import { smallestZoomLevel } from "./static/zoom";
import { breakpoints } from "../../student/zoomTheme";

export const getWordsInURLPathName = pathname => {
  // When u try to change this function change the duplicate function in "packages/api/src/utils/API.js" also
  let path = pathname;
  path += "";
  path = path.split("/");
  path = path.filter(item => !!(item && item.trim()));
  return path;
};

export const removeCommentsFromHtml = (content = "") => {
  if (typeof content !== "string") return content;
  return content.replace(/<!--[\s\S]*?-->/g, "");
};

export const isLoggedInForPrivateRoute = user => {
  if (user && user.isAuthenticated) {
    if (user && user.user && !user.user.role && (user.user.googleId || user.user.msoId || user.user.cleverId)) {
      return false;
    }
    if (user && user.user && user.user.role !== "teacher") {
      return true;
    }
    if (
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
    }
    if (
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
  // eslint-disable-next-line no-restricted-globals
  const pathname = location.pathname;
  if (
    partner.keyName !== "login" &&
    pathname.toLocaleLowerCase().includes("partnerlogin") &&
    pathname.toLocaleLowerCase().includes(partner.keyName.toLocaleLowerCase())
  ) {
    return true;
  }
  if (partner.keyName === "login" && !pathname.toLocaleLowerCase().includes("partnerlogin")) {
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
  const partnersArr = Object.keys(Partners);
  const tempPartner = pathArr[partnersArr.length - 1];
  const foundPartner = partnersArr.find(item => item === tempPartner);
  if (foundPartner) {
    return foundPartner;
  }
  return "login";
};

export const getDistrictLoginUrl = (orgShortName, orgType) => `/${orgType}/${orgShortName}`;

export const getDistrictTeacherSignupUrl = (orgShortName, orgType) => `/${orgType}/${orgShortName}/signup`;

export const getDistrictStudentSignupUrl = (orgShortName, orgType) => `/${orgType}/${orgShortName}/studentsignup`;

export const getDistrictGetStartedUrl = (orgShortName, orgType) => `/${orgType}/${orgShortName}/getstarted`;

export const isDistrictPolicyAllowed = (isSignupUsingDaURL, districtPolicy, name) => {
  if (isSignupUsingDaURL && districtPolicy && (districtPolicy[name] || isUndefined(districtPolicy[name]))) {
    return true;
  }
  return false;
};

export const isDistrictPolicyAvailable = (isSignupUsingDaURL, districtPolicy) =>
  isSignupUsingDaURL && typeof districtPolicy === "object";

export const isEmailValid = (rule, value, callback, checks, message) => {
  const emailRegExp = new RegExp(
    "^[_A-Za-z0-9-'\\+]+(\\.[_A-Za-z0-9-']+)*@[A-Za-z0-9]+([A-Za-z0-9\\-\\.]+)*(\\.[A-Za-z]{1,25})$"
  );
  const userNameRegExp = new RegExp(`^[A-Za-z0-9._ \\-\\+\\'\\"]+$`);

  let flag = false;

  if (checks === "email") {
    flag = emailRegExp.test(value.trim());
  } else if (checks === "username") {
    flag = userNameRegExp.test(value.trim());
  } else if (checks === "both" || !checks) {
    flag = emailRegExp.test(value.trim()) || userNameRegExp.test(value.trim());
  }

  if (flag) {
    callback();
    return true;
  }
  callback(message);
};

export const getFullNameFromAsString = obj =>
  `${obj.firstName} ${obj.middleName ? `${obj.middleName} ` : ""}${obj.lastName ? obj.lastName : ""}`;

export const getFullNameFromString = name => {
  let nameList = name.split(" ");
  nameList = nameList.filter(item => !!(item && item.trim()));
  if (!nameList.length) {
    return false;
  }

  let firstName;
  let lastName;
  let middleName;
  if (nameList.length === 1) {
    firstName = nameList[0];
  } else if (nameList.length === 2) {
    firstName = nameList[0];
    lastName = nameList[1];
  } else if (nameList.length > 2) {
    firstName = nameList[0];
    middleName = nameList.slice(1, nameList.length - 1).join(" ");
    lastName = last(nameList);
  }

  return {
    firstName,
    middleName,
    lastName
  };
};

export const getInitialsFromName = obj => obj.firstName[0] + (obj.lastName ? obj.lastName[0] : "");

export const getDistrictSignOutUrl = generalSettings => {
  if (generalSettings.orgType === "institution") {
    return `/school/${generalSettings.shortName}`;
  }
  return `/district/${generalSettings.shortName}`;
};

export const setSignOutUrl = url => {
  sessionStorage.setItem("signOutUrl", url);
};

export const getSignOutUrl = () => sessionStorage.getItem("signOutUrl") || "/login";

export const removeSignOutUrl = () => sessionStorage.removeItem("signOutUrl");

export const validateQuestionsForDocBased = questions => {
  if (!questions.length) {
    notification({ type: "warn", messageKey: "aleastOneQuestion" });
    return false;
  }

  const sectionTitle = questions
    .filter(question => question.type === "sectionLabel")
    .every(question => !!question.title.trim());

  if (!sectionTitle) {
    notification({ messageKey: "sectionNameCanNotEmpty" });
    return false;
  }

  const correctAnswerPicked = questions
    .filter(question => question.type !== "sectionLabel" && question.type !== "essayPlainText")
    .every(question => {
      const validationValue = get(question, "validation.validResponse.value");
      if (question.type === "math") {
        return validationValue.every(value => !isEmpty(value.value));
      }
      return !isEmpty(validationValue);
    });

  if (!correctAnswerPicked) {
    notification({ type: "warn", messageKey: "correctAnswer" });
    return false;
  }
  return true;
};

export const addThemeBackgroundColor = elem => styled(elem)`
  background-color: ${props => props.theme.sectionBackgroundColor};
`;

export const ifZoomed = zoomLevel => zoomLevel && zoomLevel !== smallestZoomLevel;

export const isZoomGreator = (zoomLevel, levelToCheck) => breakpoints[levelToCheck] > breakpoints[zoomLevel];

export const Tooltip = ({ children, ...rest }) =>
  window.isMobileDevice || window.isIOS ? children : <AntDTooltip {...rest}>{children}</AntDTooltip>;

export const nameValidator = name => {
  const trimmedName = name.trim();

  // rules (valid name)
  // should start with alphabet
  // should contain at least three char (eg: stu, st1 s01)
  // should contain only one space between name/word
  // can contain number after initial alphabet

  const namePattern = /^(?!\d)[a-zA-Z\d]{2,}[a-zA-Z\d]+(?: [a-zA-z\d]+)*$/;
  if (!trimmedName || !namePattern.test(trimmedName)) {
    return false;
  }
  return true;
};

export const getDefaultSettings = ({ testType = "", defaultTestProfiles = {} }) => {
  switch (true) {
    case testType === testConst.type.COMMON:
      return {
        performanceBand: { _id: defaultTestProfiles?.performanceBand?.common || "" },
        standardProficiency: { _id: defaultTestProfiles?.standardProficiency?.common || "" }
      };
    case testType === testConst.type.ASSESSMENT:
      return {
        performanceBand: { _id: defaultTestProfiles?.performanceBand?.class || "" },
        standardProficiency: { _id: defaultTestProfiles?.standardProficiency?.class || "" }
      };
    case testType === testConst.type.PRACTICE:
      return {
        performanceBand: { _id: defaultTestProfiles?.performanceBand?.practice || "" },
        standardProficiency: { _id: defaultTestProfiles?.standardProficiency?.practice || "" }
      };
    default:
      return {
        performanceBand: { _id: defaultTestProfiles?.performanceBand?.common || "" },
        standardProficiency: { _id: defaultTestProfiles?.standardProficiency?.common || "" }
      };
  }
};

/**
 *
 * @param score
 * @param maxScore
 * @returns a tuple containing the type and message for notifaction [type, msg]
 */
export const getTypeAndMsgBasedOnScore = (score, maxScore) => {
  let returnValue = [];
  if (score === maxScore) {
    returnValue = ["success", "Correct"];
  } else if (score > 0) {
    returnValue = ["success", "Partially Correct"];
  } else {
    returnValue = ["error", "Incorrect"];
  }
  return returnValue;
};

/**
 * Make confirmation popup native to app
 * call router dom prompt as usual with appropriate message
 * resolve callback as per user's decision
 *  */
export const getUserConfirmation = (message, callback) =>
  Modal.confirm({
    title: "Alert",
    content: message,
    onOk: () => {
      callback(true);
      Modal.destroyAll();
    },
    okText: "Yes, Continue",
    onCancel: () => {
      callback(false);
      Modal.destroyAll();
    },
    centered: true,
    width: 500,
    okButtonProps: {
      style: { background: themeColor }
    }
  });
