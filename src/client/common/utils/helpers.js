import { signUpState } from "@edulastic/constants";
import { isUndefined } from "lodash";

export const getWordsInURLPathName = pathname => {
  let path = pathname;
  path = path + "";
  path = path.split("/");
  path = path.filter(item => (item && item.trim() ? true : false));
  return path;
};

export const isLoggedIn = user => {
  if (user && user.isAuthenticated) {
    if (user && user.user && user.user.role !== "teacher") {
      return true;
    } else if (
      user.user &&
      user.user.role === "teacher" &&
      (user.signupStatus === signUpState.DONE || isUndefined(user.signupStatus))
    ) {
      return true;
    }
    return false;
  }
  return false;
};
