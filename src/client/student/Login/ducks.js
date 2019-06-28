import { createAction, createReducer, createSelector } from "redux-starter-kit";
import { pick, last, get, set } from "lodash";
import { takeLatest, call, put, select } from "redux-saga/effects";
import { message } from "antd";
import { push } from "connected-react-router";
import { authApi, userApi, TokenStorage } from "@edulastic/api";
import { roleuser, signUpState } from "@edulastic/constants";
import { fetchAssignmentsAction } from "../Assignments/ducks";
import { fetchSkillReportByClassID as fetchSkillReportAction } from "../SkillReport/ducks";
import { receiveLastPlayListAction, receiveRecentPlayListsAction } from "../../author/Playlist/ducks";
import { getWordsInURLPathName } from "../../common/utils/helpers";
import { userPickFields } from "../../common/utils/static/user";
import { signupDistrictPolicySelector, signupGeneralSettingsSelector } from "../Signup/duck";
import { getFromLocalStorage } from "@edulastic/api/src/utils/Storage";
import { getUser } from "../../author/src/selectors/user";

// types
export const LOGIN = "[auth] login";
export const GOOGLE_LOGIN = "[auth] google login";
export const CLEVER_LOGIN = "[auth] clever login";
export const MSO_LOGIN = "[auth] mso login";
export const GOOGLE_SSO_LOGIN = "[auth] google sso login";
export const CLEVER_SSO_LOGIN = "[auth] clever sso login";
export const MSO_SSO_LOGIN = "[auth] mso sso login";
export const GET_USER_DATA = "[auth] get user data from sso response";
export const SET_USER = "[auth] set user";
export const SIGNUP = "[auth] signup";
export const SINGUP_SUCCESS = "[auth] signup success";
export const FETCH_USER = "[auth] fetch user";
export const FETCH_V1_REDIRECT = "[v1 redirect] fetch";
export const LOGOUT = "[auth] logout";
export const CHANGE_CLASS = "[student] change class";
export const LOAD_SKILL_REPORT_BY_CLASSID = "[reports] load skill report by class id";
export const UPDATE_USER_ROLE_REQUEST = "[auth] update user role request";

// actions
export const loginAction = createAction(LOGIN);
export const googleLoginAction = createAction(GOOGLE_LOGIN);
export const cleverLoginAction = createAction(CLEVER_LOGIN);
export const msoLoginAction = createAction(MSO_LOGIN);
export const googleSSOLoginAction = createAction(GOOGLE_SSO_LOGIN);
export const cleverSSOLoginAction = createAction(CLEVER_SSO_LOGIN);
export const getUserDataAction = createAction(GET_USER_DATA);
export const msoSSOLoginAction = createAction(MSO_SSO_LOGIN);
export const setUserAction = createAction(SET_USER);
export const signupAction = createAction(SIGNUP);
export const signupSuccessAction = createAction(SINGUP_SUCCESS);
export const fetchUserAction = createAction(FETCH_USER);
export const fetchV1RedirectAction = createAction(FETCH_V1_REDIRECT);
export const logoutAction = createAction(LOGOUT);
export const changeClassAction = createAction(CHANGE_CLASS);
export const updateUserRoleAction = createAction(UPDATE_USER_ROLE_REQUEST);

const initialState = {
  isAuthenticated: false,
  authenticating: true,
  signupStatus: 0
};

const setUser = (state, { payload }) => {
  const defaultClass = get(payload, "orgData.classList", []).length > 1 ? "" : get(payload, "orgData.defaultClass");
  state.user = payload;
  set(state.user, "orgData.defaultClass", defaultClass);
  state.isAuthenticated = true;
  state.authenticating = false;
  state.signupStatus = payload.currentSignUpState;
};

const getCurrentPath = () => {
  const { location } = window;
  const path = getWordsInURLPathName(location.pathname.toLocaleLowerCase());
  if (
    location.pathname.toLowerCase() === "/getstarted" ||
    location.pathname.toLowerCase() === "/signup" ||
    location.pathname.toLowerCase() === "/studentsignup" ||
    location.pathname.toLowerCase() === "/adminsignup" ||
    (path[0] && path[0] === "district")
  ) {
    return "";
  } else {
    return `${location.pathname}${location.search}${location.hash}`;
  }
};

export default createReducer(initialState, {
  [SET_USER]: setUser,
  [CHANGE_CLASS]: (state, { payload }) => {
    if (!(state.user && state.user.orgData)) {
      return state;
    }
    state.user.orgData.defaultClass = payload;
  },
  [FETCH_USER]: state => {
    state.isAuthenticated = false;
    state.authenticating = true;
  },
  [FETCH_V1_REDIRECT]: state => {
    state.isAuthenticated = false;
    state.authenticating = true;
  },
  [SINGUP_SUCCESS]: setUser
});

export const getClasses = createSelector(
  ["user.user.orgData.classList"],
  classes => classes
);

export const getCurrentGroup = createSelector(
  ["user.user.orgData.defaultClass"],
  r => r
);

export const getCurrentGroupWithAllClasses = createSelector(
  [
    "user.user.orgData.defaultClass",
    "studentAssignment.byId",
    "studentAssignment.current",
    "user.user.orgData.classList"
  ],
  (groupId, assignmentsById, currentAssignmentId, classes) => {
    if (groupId) {
      return groupId;
    } else if (currentAssignmentId) {
      const currentAssignment = assignmentsById[currentAssignmentId];
      if (!currentAssignment) {
        return groupId;
      }

      const allClassIds = new Set(classes.map(x => x._id));
      const assignmentClassId = currentAssignment.class.find(cl => allClassIds.has(cl._id));

      return assignmentClassId ? assignmentClassId._id : groupId;
    } else {
      return groupId;
    }
  }
);

export const getCurrentSchool = createSelector(
  ["user.user.orgData.defaultSchool"],
  r => r
);

export const getUserRole = createSelector(
  ["user.user.role"],
  r => r
);

export const getUserFeatures = createSelector(
  ["user.user.features"],
  features => features
);

const routeSelector = state => state.router.location.pathname;

function* login({ payload }) {
  try {
    const result = yield call(authApi.login, payload);
    const user = pick(result, userPickFields);
    TokenStorage.storeAccessToken(result.token, user._id, user.role, true);
    TokenStorage.selectAccessToken(user._id, user.role);
    yield put(setUserAction(user));
    if (user.role !== roleuser.STUDENT) {
      yield put(receiveLastPlayListAction());
      yield put(receiveRecentPlayListsAction());
    }

    const redirectUrl = localStorage.getItem("loginRedirectUrl");

    const isAuthUrl = /signup|login/gi.test(redirectUrl);
    if (redirectUrl && !isAuthUrl) {
      localStorage.removeItem("loginRedirectUrl");
      yield put(push(redirectUrl));
    }
    // Important redirection code removed, redirect code already present in /src/client/App.js
    // it receives new user props in each steps of teacher signup and for other roles
  } catch (err) {
    console.error(err);
    const errorMessage = "Invalid username or password";
    yield call(message.error, errorMessage);
  }
}

const checkEmailPolicy = (policy, role, email) => {
  if (!policy) {
    return true;
  }
  let inputDomain = email.split("@")[1];
  let allowedDomains;
  if (role === "teacher") {
    allowedDomains = policy.allowedDomainForTeachers
      ? policy.allowedDomainForTeachers.map(item => item.toLocaleLowerCase())
      : [];
  } else if (role === "student") {
    allowedDomains = policy.allowedDomainForStudents
      ? policy.allowedDomainForStudents.map(item => item.toLocaleLowerCase())
      : [];
  } else if (role === "da") {
    allowedDomains = policy.allowedDomainsForDistrict
      ? policy.allowedDomainsForDistrict.map(item => item.toLocaleLowerCase())
      : [];
  }
  if (allowedDomains.includes(inputDomain.toLocaleLowerCase())) {
    return true;
  } else {
    return false;
  }
};

function* signup({ payload }) {
  const districtPolicy = yield select(signupDistrictPolicySelector);

  try {
    const { name, email, password, role, classCode, policyvoilation } = payload;
    let nameList = name.split(" ");
    nameList = nameList.filter(item => (item && item.trim() ? true : false));
    if (!nameList.length) {
      throw { message: "Please provide your full name." };
    }
    if (!checkEmailPolicy(districtPolicy, role, email)) {
      throw {
        message: policyvoilation
      };
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

    const obj = {
      password,
      email,
      firstName,
      middleName,
      lastName,
      role
    };

    if (classCode) {
      obj.code = classCode;
    }

    const response = yield call(authApi.signup, obj);
    const { message: _responseMsg, result } = response;

    if (_responseMsg && !result) {
      yield call(message.error, _responseMsg);
    } else {
      const user = pick(result, userPickFields);

      TokenStorage.storeAccessToken(result.token, user._id, user.role, true);
      TokenStorage.selectAccessToken(user._id, user.role);
      yield put(signupSuccessAction(result));
      localStorage.removeItem("loginRedirectUrl");

      // Important redirection code removed, redirect code already present in /src/client/App.js
      // it receives new user props in each steps of teacher signup and for other roles
    }
  } catch (err) {
    const errorMessage = "Email already exist";
    yield call(message.error, err && err.message ? err.message : errorMessage);
  }
}

const getLoggedOutUrl = () => {
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

export function* fetchUser() {
  try {
    // TODO: handle the case of invalid token
    if (!TokenStorage.getAccessToken()) {
      localStorage.setItem("loginRedirectUrl", getCurrentPath());
      yield put(push(getLoggedOutUrl()));
      return;
    }
    const user = yield call(userApi.getUser);
    const key = localStorage.getItem("defaultTokenKey") + "";

    if (key.includes("role:undefined") && user.role) {
      TokenStorage.removeAccessToken(user._id, "undefined");
      TokenStorage.storeAccessToken(user.token, user._id, user.role, true);
      TokenStorage.selectAccessToken(user._id, user.role);
    }
    yield put({
      type: SET_USER,
      payload: user
    });
    if (user.role !== roleuser.STUDENT) {
      yield put(receiveLastPlayListAction());
      yield put(receiveRecentPlayListsAction());
    }
  } catch (e) {
    console.log(e);
    yield call(message.error, "failed loading user data");
    if (error.response && error.response.status === 501) {
    } else {
      window.localStorage.setItem("loginRedirectUrl", getCurrentPath());
      yield put(push(getLoggedOutUrl()));
    }
  }
}

export function* fetchV1Redirect({ payload: id }) {
  try {
    // TODO: handle the case of invalid token
    const { authToken, _id, role } = yield call(authApi.V1Redirect, id);
    if (authToken) {
      TokenStorage.storeAccessToken(authToken, _id, role);
      TokenStorage.selectAccessToken(_id, role);
    } else {
      yield call(message.error, "authtoken invalid on redirection");
      return;
    }

    const user = yield call(userApi.getUser);
    const key = localStorage.getItem("defaultTokenKey") + "";

    yield put({
      type: SET_USER,
      payload: user
    });
    let redirectUrl = "/author/assignments";
    if (role === "student") {
      redirectUrl = "/home/assignments";
    }
    yield put(push(redirectUrl));
  } catch (e) {
    console.log(e);
    yield call(message.error, "failed loading user data");
  }
}

function* logout() {
  try {
    localStorage.clear();
    yield put({ type: "RESET" });
    yield put(push("/login"));
  } catch (e) {
    console.log(e);
  }
}

function* changeClass({ payload }) {
  try {
    const url = yield select(routeSelector);
    if (url.includes("/home/skill-report")) {
      yield put(fetchSkillReportAction(payload));
    } else {
      yield put(fetchAssignmentsAction(payload));
    }
  } catch (e) {
    console.log(e);
  }
}

function* googleLogin({ payload }) {
  try {
    if (payload) {
      localStorage.setItem("thirdPartySignOnRole", payload);
    }
    const res = yield call(authApi.googleLogin);
    window.location.href = res;
  } catch (e) {
    yield call(message.error, "Google Login failed");
  }
}

function* googleSSOLogin({ payload }) {
  try {
    const res = yield call(authApi.googleSSOLogin, payload);
    yield put(getUserDataAction(res));
  } catch (e) {
    yield call(message.error, "Google Login failed");
    yield put(push("/login"));
  }
}

function* msoLogin({ payload }) {
  try {
    if (payload) {
      localStorage.setItem("thirdPartySignOnRole", payload);
    }
    const res = yield call(authApi.msoLogin);
    window.location.href = res;
  } catch (e) {
    yield call(message.error, "MSO Login failed");
  }
}

function* msoSSOLogin({ payload }) {
  try {
    const res = yield call(authApi.msoSSOLogin, payload);
    yield put(getUserDataAction(res));
  } catch (e) {
    yield call(message.error, "MSO Login failed");
    yield put(push("/login"));
  }
}

function* cleverLogin({ payload }) {
  try {
    if (payload) {
      localStorage.setItem("thirdPartySignOnRole", payload);
    }
    const res = yield call(authApi.cleverLogin);
    window.location.href = res;
  } catch (e) {
    yield call(message.error, "Clever Login failed");
  }
}

function* cleverSSOLogin({ payload }) {
  try {
    const res = yield call(authApi.cleverSSOLogin, payload);
    yield put(getUserDataAction(res));
  } catch (e) {
    yield call(message.error, "Clever Login failed");
    yield put(push("/login"));
  }
}

function* getUserData({ payload: res }) {
  try {
    const user = pick(res, userPickFields);
    TokenStorage.storeAccessToken(res.token, user._id, user.role, true);
    TokenStorage.selectAccessToken(user._id, user.role);
    yield put(setUserAction(user));
    if (user.role !== roleuser.STUDENT) {
      yield put(receiveLastPlayListAction());
      yield put(receiveRecentPlayListsAction());
    }
    const redirectUrl = getFromLocalStorage("loginRedirectUrl");

    const isAuthUrl = /signup|login/gi.test(redirectUrl);
    if (redirectUrl && !isAuthUrl) {
      localStorage.removeItem("loginRedirectUrl");
      yield put(push(redirectUrl));
    }

    // Important redirection code removed, redirect code already present in /src/client/App.js
    // it receives new user props in each steps of teacher signup and for other roles
  } catch (e) {
    yield call(message.error, "Failed to fetch user data.");
    yield put(push("/login"));
  }
}

function* updateUserRoleSaga({ payload }) {
  try {
    const user = yield select(getUser);
    const res = yield call(userApi.updateUserRole, { data: { role: payload }, userId: user._id });
    const _user = {
      ...user,
      role: payload
    };

    TokenStorage.removeAccessToken(_user._id, "undefined");

    TokenStorage.storeAccessToken(res.token, _user._id, _user.role, true);
    TokenStorage.selectAccessToken(_user._id, _user.role);
    yield put(signupSuccessAction(_user));
  } catch (e) {
    yield call(message.error, "Failed to update user please try again.");
  }
}

export function* watcherSaga() {
  yield takeLatest(LOGIN, login);
  yield takeLatest(SIGNUP, signup);
  yield takeLatest(LOGOUT, logout);
  yield takeLatest(FETCH_USER, fetchUser);
  yield takeLatest(FETCH_V1_REDIRECT, fetchV1Redirect);
  yield takeLatest(CHANGE_CLASS, changeClass);
  yield takeLatest(GOOGLE_LOGIN, googleLogin);
  yield takeLatest(CLEVER_LOGIN, cleverLogin);
  yield takeLatest(MSO_LOGIN, msoLogin);
  yield takeLatest(GOOGLE_SSO_LOGIN, googleSSOLogin);
  yield takeLatest(CLEVER_SSO_LOGIN, cleverSSOLogin);
  yield takeLatest(GET_USER_DATA, getUserData);
  yield takeLatest(MSO_SSO_LOGIN, msoSSOLogin);
  yield takeLatest(UPDATE_USER_ROLE_REQUEST, updateUserRoleSaga);
}
