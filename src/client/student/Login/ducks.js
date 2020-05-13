import { createAction, createReducer, createSelector } from "redux-starter-kit";
import { pick, last, get, set } from "lodash";
import { takeLatest, call, put, select } from "redux-saga/effects";
import { message } from "antd";
import { push } from "connected-react-router";
import { authApi, userApi, TokenStorage, settingsApi, segmentApi } from "@edulastic/api";
import { roleuser } from "@edulastic/constants";
import { fetchAssignmentsAction } from "../Assignments/ducks";
import { receiveLastPlayListAction, receiveRecentPlayListsAction } from "../../author/Playlist/ducks";
import {
  getWordsInURLPathName,
  getDistrictSignOutUrl,
  setSignOutUrl,
  getSignOutUrl,
  removeSignOutUrl
} from "../../common/utils/helpers";
import { userPickFields } from "../../common/utils/static/user";
import { signupDistrictPolicySelector, signupGeneralSettingsSelector } from "../Signup/duck";
import { getUser } from "../../author/src/selectors/user";
import { updateInitSearchStateAction } from "../../author/TestPage/components/AddItems/ducks";
import { JOIN_CLASS_REQUEST_SUCCESS } from "../ManageClass/ducks";
import * as firebase from "firebase/app";
import "firebase/auth";

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
export const FETCH_USER_FAILURE = "[auth] fetch user failure";
export const FETCH_V1_REDIRECT = "[v1 redirect] fetch";
export const LOGOUT = "[auth] logout";
export const CHANGE_CLASS = "[student] change class";
export const CHANGE_CHILD = "[parent] change child";
export const LOAD_SKILL_REPORT_BY_CLASSID = "[reports] load skill report by class id";
export const UPDATE_USER_ROLE_REQUEST = "[auth] update user role request";
export const SET_USER_GOOGLE_LOGGED_IN = "[auth] set user google logged in";
export const UPDATE_PROFILE_IMAGE_PATH_REQUEST = "[user] update profile image path";
export const UPDATE_PROFILE_IMAGE_PATH_SUCCESS = "[user] update profile image path success";
export const UPDATE_PROFILE_IMAGE_PATH_FAILED = "[user] update profile image path failed";

export const REQUEST_NEW_PASSWORD_REQUEST = "[auth] request new password request";
export const REQUEST_NEW_PASSWORD_RESET_CONTROL = "[auth] request new password reset control";
export const REQUEST_NEW_PASSWORD_FAILED = "[auth] request new password failed";
export const REQUEST_NEW_PASSWORD_SUCCESS = "[auth] request new password success";
export const RESET_PASSWORD_USER_REQUEST = "[auth] reset password user request";
export const RESET_PASSWORD_USER_SUCCESS = "[auth] reset password user success";
export const RESET_PASSWORD_REQUEST = "[auth] reset password request";
export const RESET_PASSWORD_FAILED = "[auth] reset password failed";
export const RESET_PASSWORD_SUCCESS = "[auth] reset password success";
export const STUDENT_SIGNUP_CHECK_CLASSCODE_REQUEST = "[auth] student signup check classcode request";
export const UPDATE_DEFAULT_GRADES = "[user] update default grades";
export const UPDATE_DEFAULT_SUBJECT = "[user] update default subject";
export const GET_INVITE_DETAILS_REQUEST = "[auth] get invite details request";
export const GET_INVITE_DETAILS_SUCCESS = "[auth] get invite details success";
export const SET_INVITE_DETAILS_REQUEST = "[auth] set invite details request";
export const SET_INVITE_DETAILS_SUCCESS = "[auth] set invite details success";
export const RESET_MY_PASSWORD_REQUEST = "[auth] reset my password request";
export const RESET_MY_PASSWORD_FAILED = "[auth] reset my password failed";
export const RESET_MY_PASSWORD_SUCCESS = "[auth] reset my password success";
export const UPDATE_USER_DETAILS_REQUEST = "[user] update user details";
export const UPDATE_USER_DETAILS_SUCCESS = "[user] update user details success";
export const UPDATE_USER_DETAILS_FAILED = "[user] update user details failed";
export const DELETE_ACCOUNT_REQUEST = "[auth] delete account";
export const UPDATE_INTERESTED_CURRICULUMS_REQUEST = "[user] update interested curriculums request";
export const UPDATE_INTERESTED_CURRICULUMS_SUCCESS = "[user] update interested curriculums success";
export const UPDATE_INTERESTED_CURRICULUMS_FAILED = "[user] update interested curriculums failed";
export const REMOVE_SCHOOL_REQUEST = "[user] remove school request";
export const REMOVE_SCHOOL_SUCCESS = "[user] remove school success";
export const REMOVE_SCHOOL_FAILED = "[user] remove school failed";
export const REMOVE_INTERESTED_CURRICULUMS_REQUEST = "[user] remove interested curriculums request";
export const GET_CURRENT_DISTRICT_USERS_REQUEST = "[user] get current district users request";
export const GET_CURRENT_DISTRICT_USERS_SUCCESS = "[user] get current district users success";

export const UPDATE_DEFAULT_SETTINGS_REQUEST = "[user] update default settings request";
export const UPDATE_DEFAULT_SETTINGS_SUCCESS = "[user] update default settings success";
export const UPDATE_DEFAULT_SETTINGS_FAILED = "[user] update default settings failed";

export const SET_SETTINGS_SA_SCHOOL = "[user] set sa settings school";
export const SET_SIGNUP_STATUS = "[user] set signup status";

// actions
export const setSettingsSaSchoolAction = createAction(SET_SETTINGS_SA_SCHOOL);
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
export const setUserGoogleLoggedInAction = createAction(SET_USER_GOOGLE_LOGGED_IN);
export const updateUserRoleAction = createAction(UPDATE_USER_ROLE_REQUEST);
export const requestNewPasswordAction = createAction(REQUEST_NEW_PASSWORD_REQUEST);
export const requestNewPasswordResetControlAction = createAction(REQUEST_NEW_PASSWORD_RESET_CONTROL);
export const resetPasswordUserAction = createAction(RESET_PASSWORD_USER_REQUEST);
export const resetPasswordAction = createAction(RESET_PASSWORD_REQUEST);
export const studentSignupCheckClasscodeAction = createAction(STUDENT_SIGNUP_CHECK_CLASSCODE_REQUEST);
export const updateDefaultSubjectAction = createAction(UPDATE_DEFAULT_SUBJECT);
export const updateDefaultGradesAction = createAction(UPDATE_DEFAULT_GRADES);
export const getInviteDetailsAction = createAction(GET_INVITE_DETAILS_REQUEST);
export const setInviteDetailsAction = createAction(SET_INVITE_DETAILS_REQUEST);
export const resetMyPasswordAction = createAction(RESET_MY_PASSWORD_REQUEST);
export const updateProfileImageAction = createAction(UPDATE_PROFILE_IMAGE_PATH_REQUEST);
export const updateUserDetailsAction = createAction(UPDATE_USER_DETAILS_REQUEST);
export const deleteAccountAction = createAction(DELETE_ACCOUNT_REQUEST);
export const updateInterestedCurriculumsAction = createAction(UPDATE_INTERESTED_CURRICULUMS_REQUEST);
export const removeSchoolAction = createAction(REMOVE_SCHOOL_REQUEST);
export const removeInterestedCurriculumsAction = createAction(REMOVE_INTERESTED_CURRICULUMS_REQUEST);
export const getCurrentDistrictUsersAction = createAction(GET_CURRENT_DISTRICT_USERS_REQUEST);
export const getCurrentDistrictUsersSuccessAction = createAction(GET_CURRENT_DISTRICT_USERS_SUCCESS);
export const changeChildAction = createAction(CHANGE_CHILD);
export const updateDefaultSettingsAction = createAction(UPDATE_DEFAULT_SETTINGS_REQUEST);
export const setSignUpStatusAction = createAction(SET_SIGNUP_STATUS);
export const fetchUserFailureAction = createAction(FETCH_USER_FAILURE);

const initialState = {
  isAuthenticated: false,
  authenticating: true,
  signupStatus: 0,
  currentChild: null
};

const setUser = (state, { payload }) => {
  const defaultGrades =
    TokenStorage.getFromLocalStorage("defaultGrades") != null
      ? TokenStorage.getFromLocalStorage("defaultGrades")
        ? TokenStorage.getFromLocalStorage("defaultGrades").split(",")
        : []
      : null;

  const defaultSubject = TokenStorage.getFromLocalStorage("defaultSubject");
  const defaultClass = get(payload, "orgData.classList", []).length > 1 ? "" : get(payload, "orgData.defaultClass");
  state.user = payload;
  if (payload.role === "parent" && payload?.children?.length > 0) {
    state.currentChild = payload.children[0]._id;
    set(state, "user.orgData", payload.children[0].orgData);
  }
  state.user.middleName = payload.middleName || undefined;
  state.user.lastName = payload.lastName || undefined;
  set(state.user, "orgData.defaultClass", defaultClass);
  set(state.user, "orgData.selectedGrades", defaultGrades);
  set(state.user, "orgData.selectedSubject", defaultSubject);
  let schools = payload?.orgData?.schools || [];
  schools = schools.sort((a, b) => a.name.localeCompare(b.name));
  if (payload.role === "school-admin" && schools.length) {
    // setting first school as default on initial load
    state.saSettingsSchool = schools[0]._id;
  }
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
    location.pathname.toLowerCase() === "/inviteteacher" ||
    (path[0] && path[0] === "district")
  ) {
    return "";
  }
  return `${location.pathname}${location.search}${location.hash}`;
};

export default createReducer(initialState, {
  [SET_USER]: setUser,
  [SET_SETTINGS_SA_SCHOOL]: (state, { payload }) => {
    state.saSettingsSchool = payload;
  },
  [CHANGE_CLASS]: (state, { payload }) => {
    if (!(state.user && state.user.orgData)) {
      return state;
    }
    state.user.orgData.defaultClass = payload;
  },
  [UPDATE_DEFAULT_GRADES]: (state, { payload }) => {
    state.user.orgData.selectedGrades = payload;
  },
  [UPDATE_DEFAULT_SUBJECT]: (state, { payload }) => {
    state.user.orgData.selectedSubject = payload;
  },
  [FETCH_USER]: (state, { payload }) => {
    if (!payload?.background) {
      state.authenticating = true;
      state.isAuthenticated = false;
    }
  },
  [FETCH_USER_FAILURE]: state => {
    state.isAuthenticated = false;
  },
  [FETCH_V1_REDIRECT]: state => {
    state.isAuthenticated = false;
    state.authenticating = true;
  },
  [SET_USER_GOOGLE_LOGGED_IN]: (state, { payload }) => {
    state.user.isUserGoogleLoggedIn = payload;
  },
  [SINGUP_SUCCESS]: setUser,
  [REQUEST_NEW_PASSWORD_REQUEST]: state => {
    state.requestingNewPassword = true;
    state.requestNewPasswordSuccess = false;
  },
  [REQUEST_NEW_PASSWORD_FAILED]: state => {
    state.requestingNewPassword = false;
  },
  [REQUEST_NEW_PASSWORD_SUCCESS]: (state, { payload }) => {
    state.requestingNewPassword = false;
    state.requestNewPasswordSuccess = payload;
  },
  [REQUEST_NEW_PASSWORD_RESET_CONTROL]: state => {
    state.requestingNewPassword = false;
    state.requestNewPasswordSuccess = false;
  },
  [RESET_PASSWORD_USER_SUCCESS]: (state, { payload }) => {
    state.resetPasswordUser = payload;
  },
  [RESET_PASSWORD_REQUEST]: state => {
    state.requestingNewPassword = true;
  },
  [RESET_PASSWORD_SUCCESS]: state => {
    delete state.resetPasswordUser;
    state.requestingNewPassword = false;
  },
  [RESET_PASSWORD_FAILED]: state => {
    state.requestingNewPassword = false;
  },
  [GET_INVITE_DETAILS_SUCCESS]: (state, { payload }) => {
    state.invitedUserDetails = payload;
  },
  [SET_INVITE_DETAILS_SUCCESS]: setUser,
  [RESET_MY_PASSWORD_REQUEST]: state => {
    state.requestingChangePassword = true;
  },
  [RESET_MY_PASSWORD_SUCCESS]: state => {
    state.requestingChangePassword = false;
  },
  [RESET_MY_PASSWORD_FAILED]: state => {
    state.requestingChangePassword = false;
  },
  [UPDATE_PROFILE_IMAGE_PATH_REQUEST]: state => {
    state.user.updatingImagePath = true;
  },
  [UPDATE_PROFILE_IMAGE_PATH_SUCCESS]: (state, { payload }) => {
    state.user.updatingImagePath = false;
    state.user.thumbnail = payload;
  },
  [UPDATE_PROFILE_IMAGE_PATH_FAILED]: state => {
    state.user.updatingImagePath = false;
  },
  [UPDATE_USER_DETAILS_REQUEST]: state => {
    state.updatingUserDetails = true;
  },
  [UPDATE_USER_DETAILS_SUCCESS]: (state, { payload }) => {
    delete state.updatingUserDetails;
    state.user = {
      ...state.user,
      ...payload
    };
  },
  [UPDATE_USER_DETAILS_FAILED]: state => {
    delete state.updatingUserDetails;
  },
  [UPDATE_INTERESTED_CURRICULUMS_REQUEST]: state => {
    state.updatingInterestedCurriculums = true;
  },
  [UPDATE_INTERESTED_CURRICULUMS_SUCCESS]: (state, { payload }) => {
    state.updatingInterestedCurriculums = undefined;
    state.user.orgData.interestedCurriculums = payload;
  },
  [UPDATE_INTERESTED_CURRICULUMS_FAILED]: state => {
    state.updatingInterestedCurriculums = undefined;
  },
  [REMOVE_SCHOOL_REQUEST]: state => {
    state.removingSchool = true;
  },
  [REMOVE_SCHOOL_SUCCESS]: (state, { payload }) => {
    state.removingSchool = undefined;
    const updatedSchoolIds = state.user.institutionIds.filter(id => id !== payload);
    const updatedSchools = state.user.orgData.schools.filter(school => school._id !== payload);
    state.user.institutionIds = updatedSchoolIds;
    state.user.orgData.institutionIds = updatedSchoolIds;
    state.user.orgData.schools = updatedSchools;
  },
  [REMOVE_SCHOOL_FAILED]: state => {
    state.removingSchool = undefined;
  },
  [REMOVE_INTERESTED_CURRICULUMS_REQUEST]: (state, { payload }) => {
    const updatedCurriculums = state.user.orgData.interestedCurriculums.filter(
      curriculum => curriculum._id !== payload
    );
    state.user.orgData.interestedCurriculums = updatedCurriculums;
  },
  [GET_CURRENT_DISTRICT_USERS_SUCCESS]: (state, { payload }) => {
    state.user.currentDistrictUsers = payload;
  },
  [CHANGE_CHILD]: (state, { payload }) => {
    state.currentChild = payload;
    set(state, "user.orgData", state.user.children.find(child => child._id === payload).orgData);
  },
  [JOIN_CLASS_REQUEST_SUCCESS]: (state, { payload }) => {
    state.user.orgData.classList.push(payload);
  },
  [UPDATE_DEFAULT_SETTINGS_REQUEST]: state => {
    state.updatingDefaultSettings = true;
  },
  [UPDATE_DEFAULT_SETTINGS_SUCCESS]: (state, { payload }) => {
    state.updatingDefaultSettings = false;
    const { defaultGrades, defaultSubjects, autoShareGCAssignment } = payload;
    Object.assign(state.user.orgData, {
      defaultGrades,
      defaultSubjects,
      autoShareGCAssignment
    });
  },
  [UPDATE_DEFAULT_SETTINGS_FAILED]: state => {
    state.updatingDefaultSettings = false;
  },
  [SET_SIGNUP_STATUS]: (state, { payload }) => {
    state.signupStatus = payload;
  }
});

export const getUserDetails = createSelector(
  ["user.user"],
  user => user
);

export const getCurrentDistrictUsersSelector = createSelector(
  [getUserDetails],
  state => state.currentDistrictUsers
);

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
    }
    if (currentAssignmentId) {
      const currentAssignment = assignmentsById[currentAssignmentId];
      if (!currentAssignment) {
        return groupId;
      }

      const allClassIds = new Set(classes.map(x => x._id));
      const assignmentClassId = currentAssignment.class.find(cl => allClassIds.has(cl._id));

      return assignmentClassId ? assignmentClassId._id : groupId;
    }
    return groupId;
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

export const getUserId = createSelector(
  ["user.user._id", "user.currentChild"],
  (_id, currentChild) => _id || currentChild
);

export const getUserName = createSelector(
  ["user.user.firstName", "user.user.middleName", "user.user.lastName"],
  (firstName, middleName, lastName) => [firstName || "", middleName || "", lastName || ""].join(" ").trim()
);

export const getUserFeatures = createSelector(
  ["user.user.features"],
  features => features
);

const routeSelector = state => state.router.location.pathname;

function getCurrentFirebaseUser() {
  return firebase.auth().currentUser?.uid || undefined;
}

function* login({ payload }) {
  const _payload = { ...payload };
  const generalSettings = yield select(signupGeneralSettingsSelector);
  if (generalSettings) {
    if (generalSettings.orgType === "institution") {
      _payload.institutionId = generalSettings.orgId;
      _payload.institutionName = generalSettings.name;
    } else {
      _payload.districtId = generalSettings.orgId;
      _payload.districtName = generalSettings.name;
    }
  }

  try {
    const result = yield call(authApi.login, _payload);
    const user = pick(result, userPickFields);
    const firebaseUser = yield firebase.auth().signInWithCustomToken(result.firebaseAuthToken);
    //console.log(firebaseUser); // remove it while merging in dev
    TokenStorage.storeAccessToken(result.token, user._id, user.role, true);
    TokenStorage.selectAccessToken(user._id, user.role);
    TokenStorage.updateKID(user.kid);
    yield put(setUserAction(user));
    yield put(
      updateInitSearchStateAction({
        grades: user?.orgData?.defaultGrades,
        subject: user?.orgData?.defaultSubjects
      })
    );
    yield put(receiveLastPlayListAction());
    if (user.role !== roleuser.STUDENT) {
      yield put(receiveRecentPlayListsAction());
    }

    yield call(segmentApi.analyticsIdentify, { user });

    const redirectUrl = localStorage.getItem("loginRedirectUrl");

    const isAuthUrl = /signup|login/gi.test(redirectUrl);
    if (redirectUrl && !isAuthUrl) {
      localStorage.removeItem("loginRedirectUrl");
      yield put(push(redirectUrl));
    }

    if (generalSettings) {
      setSignOutUrl(getDistrictSignOutUrl(generalSettings));
    }

    // Important redirection code removed, redirect code already present in /src/client/App.js
    // it receives new user props in each steps of teacher signup and for other roles
  } catch (err) {
    const { status, data = {} } = err;
    console.error(err);
    let errorMessage = "You have entered an invalid email/username or password.";
    if (status === 403 && data.message) {
      errorMessage = data.message;
    }
    yield call(message.error, errorMessage);
  }
}

const checkEmailPolicy = (policy, role, email) => {
  if (!policy) {
    return { status: true, message: "", error: "", role };
  }
  const inputDomain = email.split("@")[1];
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
  if (
    (role === "student"
      ? !inputDomain || allowedDomains.includes(inputDomain.toLocaleLowerCase())
      : allowedDomains.includes(inputDomain.toLocaleLowerCase())) ||
    !allowedDomains.length
  ) {
    return { status: true, message: "", error: "", role };
  }
  return {
    status: false,
    message: "This email id is not allowed in your district",
    error: "domain",
    role
  };
};

function* signup({ payload }) {
  const districtPolicy = yield select(signupDistrictPolicySelector);
  const generalSettings = yield select(signupGeneralSettingsSelector);

  let districtId;
  if (generalSettings) {
    districtId = generalSettings.orgId;
  }

  try {
    const { name, email, password, role, classCode } = payload;
    let nameList = name.split(" ");
    nameList = nameList.filter(item => !!(item && item.trim()));
    if (!nameList.length) {
      throw { message: "Please provide your full name." };
    }
    const allow = checkEmailPolicy(districtPolicy, role, email);
    if (!allow.status) {
      throw allow;
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
      role,
      districtId
    };

    if (classCode) {
      obj.code = classCode;
    }

    const response = yield call(authApi.signup, obj);
    const { message: _responseMsg, result } = response;

    if (_responseMsg && !result) {
      const { errorCallback } = payload;
      if (errorCallback) {
        errorCallback(_responseMsg);
      } else {
        yield call(message.error, _responseMsg);
      }
    } else {
      const user = pick(result, userPickFields);

      TokenStorage.storeAccessToken(result.token, user._id, user.role, true);
      TokenStorage.selectAccessToken(user._id, user.role);
      yield put(signupSuccessAction(result));
      localStorage.removeItem("loginRedirectUrl");

      if (generalSettings) {
        setSignOutUrl(getDistrictSignOutUrl(generalSettings));
      }

      // Important redirection code removed, redirect code already present in /src/client/App.js
      // it receives new user props in each steps of teacher signup and for other roles
    }
  } catch (err) {
    const { role } = payload;
    let errorMessage = "Email already exists. Please sign in to your account.";
    errorMessage = role === roleuser.STUDENT ? `Username/${errorMessage}` : errorMessage;
    const msg1 = get(err, "data.message", "");
    const msg2 = get(err, "message", "");
    const msg = msg1 || msg2 || errorMessage;

    const { errorCallback } = payload;
    if (errorCallback) {
      errorCallback(msg);
    } else {
      yield call(message.error, msg);
    }
  }
}

const getLoggedOutUrl = () => {
  // When u try to change this function change the duplicate function in "packages/api/src/utils/API.js" also
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
  if (path[0] && path[0].toLocaleLowerCase() === "school" && path[1]) {
    const arr = [...path];
    arr.shift();
    const restOfPath = arr.join("/");
    return `/school/${restOfPath}`;
  }
  if (pathname === "/resetpassword") {
    return window.location.href.split(window.location.origin)[1];
  }
  if (pathname === "/inviteteacher") {
    return `${location.pathname}${location.search}${location.hash}`;
  }
  return "/login";
};

export function* fetchUser() {
  try {
    // TODO: handle the case of invalid token
    if (!TokenStorage.getAccessToken()) {
      if (!location.pathname.toLocaleLowerCase().includes(getLoggedOutUrl())) {
        localStorage.setItem("loginRedirectUrl", getCurrentPath());
      }
      yield put(push(getLoggedOutUrl()));
      return;
    }
    const firebaseUser = yield call(getCurrentFirebaseUser);
    const user = yield call(userApi.getUser, firebaseUser ? undefined : true);
    if ((!firebaseUser && user.firebaseAuthToken) || (firebaseUser && firebaseUser !== user._id)) {
      yield firebase.auth().signInWithCustomToken(user.firebaseAuthToken);
    }
    yield call(segmentApi.analyticsIdentify, { user });
    const key = `${localStorage.getItem("defaultTokenKey")}`;

    if (key.includes("role:undefined") && user.role) {
      TokenStorage.removeAccessToken(user._id, "undefined");
      TokenStorage.storeAccessToken(user.token, user._id, user.role, true);
      TokenStorage.selectAccessToken(user._id, user.role);
    }
    TokenStorage.updateKID(user.kid);
    const searchParam = yield select(state => state.router.location.search);
    if (searchParam.includes("showCliBanner=1")) localStorage.setItem("showCLIBanner", true);
    yield put(setUserAction(user));
    yield put(
      updateInitSearchStateAction({
        grades: user?.orgData?.defaultGrades,
        subject: user?.orgData?.defaultSubjects
      })
    );
    yield put(receiveLastPlayListAction());
    if (user.role !== roleuser.STUDENT) {
      yield put(receiveRecentPlayListsAction());
    }
  } catch (error) {
    console.log("err", error, error);
    yield call(message.error, "failed loading user data");
    if (!(error?.response && error?.response?.status === 501)) {
      if (!location.pathname.toLocaleLowerCase().includes(getLoggedOutUrl())) {
        localStorage.setItem("loginRedirectUrl", getCurrentPath());
      }
      const pathname = window.location.pathname.toLocaleLowerCase().split("/");
      yield put(fetchUserFailureAction());
      if (!(pathname.includes("public") && pathname.includes("view-test"))) {
        yield put(push(getLoggedOutUrl()));
      }
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
    TokenStorage.updateKID(user.kid);
    yield put(setUserAction(user));
    yield put(
      updateInitSearchStateAction({
        grades: user?.orgData?.defaultGrades,
        subject: user?.orgData?.defaultSubjects
      })
    );
    const redirectUrl = role === "student" ? "/home/assignments" : "/author/dashboard";
    yield put(push(redirectUrl));
  } catch (e) {
    console.log(e);
    yield call(message.error, "failed loading user data");
  }
}

function* logout() {
  try {
    const user = yield select(getUser);
    const proxyParent = TokenStorage.getProxyParent();
    if (proxyParent && proxyParent._id !== user._id) {
      window.close();
    } else {
      yield call(segmentApi.unloadIntercom, { user });
      localStorage.clear();
      sessionStorage.removeItem("cliBannerShown");
      sessionStorage.removeItem("cliBannerVisible");
      TokenStorage.removeKID();
      TokenStorage.initKID();
      yield put({ type: "RESET" });
      yield put(push(getSignOutUrl()));
      removeSignOutUrl();
    }
  } catch (e) {
    console.log(e);
  }
}

function* changeClass({ payload }) {
  try {
    const url = yield select(routeSelector);
    if (!url.includes("/home/skill-mastery")) {
      yield put(fetchAssignmentsAction(payload));
    }
  } catch (e) {
    console.log(e);
  }
}

function* googleLogin({ payload }) {
  const generalSettings = yield select(signupGeneralSettingsSelector);
  let districtId;
  if (generalSettings) {
    localStorage.setItem("thirdPartySignOnGeneralSettings", JSON.stringify(generalSettings));
    districtId = generalSettings.orgId;

    setSignOutUrl(getDistrictSignOutUrl(generalSettings));
  }

  try {
    let classCode = "";
    let role = "";
    if (payload) {
      if (payload.role === "teacher") {
        localStorage.setItem("thirdPartySignOnRole", payload.role);
        role = "teacher";
      } else if (payload.role === "student") {
        localStorage.setItem("thirdPartySignOnRole", payload.role);
        localStorage.setItem("thirdPartySignOnClassCode", payload.classCode);
        classCode = payload.classCode;
        role = "student";
      }
    }

    if (classCode) {
      const validate = yield call(authApi.validateClassCode, {
        classCode,
        signOnMethod: "googleSignOn",
        role,
        districtId
      });
    }

    const res = yield call(authApi.googleLogin);
    window.location.href = res;
  } catch (e) {
    yield call(message.error, e.data && e.data.message ? e.data.message : "Google Login failed");
  }
}

function* googleSSOLogin({ payload }) {
  const _payload = { ...payload };

  let generalSettings = localStorage.getItem("thirdPartySignOnGeneralSettings");
  if (generalSettings) {
    generalSettings = JSON.parse(generalSettings);
    _payload.districtId = generalSettings.orgId;
    _payload.districtName = generalSettings.name;
  }

  try {
    if (_payload.edulasticRole === "student") {
      const classCode = localStorage.getItem("thirdPartySignOnClassCode");
      if (classCode) {
        _payload.classCode = classCode;
      }
    }
    const res = yield call(authApi.googleSSOLogin, _payload);
    yield put(getUserDataAction(res));
  } catch (e) {
    yield call(message.error, get(e, "data.message", "Google Login failed"));

    yield put(push(getSignOutUrl()));
    removeSignOutUrl();
  }
  localStorage.removeItem("thirdPartySignOnRole");
  localStorage.removeItem("thirdPartySignOnClassCode");
  localStorage.removeItem("thirdPartySignOnGeneralSettings");
}

function* msoLogin({ payload }) {
  const generalSettings = yield select(signupGeneralSettingsSelector);
  let districtId;
  if (generalSettings) {
    localStorage.setItem("thirdPartySignOnGeneralSettings", JSON.stringify(generalSettings));
    districtId = generalSettings.orgId;

    setSignOutUrl(getDistrictSignOutUrl(generalSettings));
  }

  try {
    let classCode = "";
    let role = "";
    if (payload) {
      if (payload.role === "teacher") {
        localStorage.setItem("thirdPartySignOnRole", payload.role);
        role = "teacher";
      } else if (payload.role === "student") {
        localStorage.setItem("thirdPartySignOnRole", payload.role);
        localStorage.setItem("thirdPartySignOnClassCode", payload.classCode);
        classCode = payload.classCode;
        role = "student";
      }
    }
    if (classCode) {
      const validate = yield call(authApi.validateClassCode, {
        classCode,
        signOnMethod: "office365SignOn",
        role,
        districtId
      });
    }
    const res = yield call(authApi.msoLogin);
    window.location.href = res;
  } catch (e) {
    yield call(message.error, get(e, "data.message", "MSO Login failed"));
  }
}

function* msoSSOLogin({ payload }) {
  const _payload = { ...payload };

  let generalSettings = localStorage.getItem("thirdPartySignOnGeneralSettings");
  if (generalSettings) {
    generalSettings = JSON.parse(generalSettings);
    _payload.districtId = generalSettings.orgId;
    _payload.districtName = generalSettings.name;
  }

  try {
    if (_payload.edulasticRole === "student") {
      const classCode = localStorage.getItem("thirdPartySignOnClassCode");
      if (classCode) {
        _payload.classCode = classCode;
      }
    }
    const res = yield call(authApi.msoSSOLogin, _payload);
    yield put(getUserDataAction(res));
  } catch (e) {
    yield call(message.error, get(e, "data.message", "MSO Login failed"));

    yield put(push(getSignOutUrl()));
    removeSignOutUrl();
  }
  localStorage.removeItem("thirdPartySignOnRole");
  localStorage.removeItem("thirdPartySignOnClassCode");
  localStorage.removeItem("thirdPartySignOnGeneralSettings");
}

function* cleverLogin({ payload }) {
  const generalSettings = yield select(signupGeneralSettingsSelector);
  if (generalSettings) {
    localStorage.setItem("thirdPartySignOnGeneralSettings", JSON.stringify(generalSettings));

    setSignOutUrl(getDistrictSignOutUrl(generalSettings));
  }

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
  const _payload = { ...payload };

  let generalSettings = localStorage.getItem("thirdPartySignOnGeneralSettings");
  if (generalSettings) {
    generalSettings = JSON.parse(generalSettings);
    _payload.districtId = generalSettings.orgId;
    _payload.districtName = generalSettings.name;
  }

  try {
    const res = yield call(authApi.cleverSSOLogin, _payload);
    yield put(getUserDataAction(res));
  } catch (e) {
    if (e?.data?.message === "User not yet authorized to use Edulastic. Please contact your district administrator!") {
      yield put(push({ pathname: getSignOutUrl(), state: { showCleverUnauthorized: true }, hash: "#login" }));
    } else {
      yield call(message.error, e?.data?.message || "Clever Login failed");
      yield put(push(getSignOutUrl()));
    }
    removeSignOutUrl();
  }
  localStorage.removeItem("thirdPartySignOnRole");
  localStorage.removeItem("thirdPartySignOnGeneralSettings");
}

function* getUserData({ payload: res }) {
  try {
    const { firebaseAuthToken } = res;
    const firebaseUser = yield call(getCurrentFirebaseUser);
    if ((!firebaseUser && firebaseAuthToken) || (firebaseUser && firebaseUser !== res._id)) {
      yield firebase.auth().signInWithCustomToken(firebaseAuthToken);
    }
    const user = pick(res, userPickFields);
    TokenStorage.storeAccessToken(res.token, user._id, user.role, true);
    TokenStorage.selectAccessToken(user._id, user.role);
    TokenStorage.updateKID(user.kid);
    yield put(setUserAction(user));
    yield put(receiveLastPlayListAction());
    if (user.role !== roleuser.STUDENT) {
      yield put(receiveRecentPlayListsAction());
    }
    const redirectUrl = TokenStorage.getFromLocalStorage("loginRedirectUrl");

    const isAuthUrl = /signup|login/gi.test(redirectUrl);
    if (redirectUrl && !isAuthUrl) {
      localStorage.removeItem("loginRedirectUrl");
      yield put(push(redirectUrl));
    }

    // Important redirection code removed, redirect code already present in /src/client/App.js
    // it receives new user props in each steps of teacher signup and for other roles
  } catch (e) {
    yield call(message.error, "Failed to fetch user data.");

    yield put(push(getSignOutUrl()));
    removeSignOutUrl();
  }
}

function* updateUserRoleSaga({ payload }) {
  try {
    const user = yield select(getUser);
    const res = yield call(userApi.updateUserRole, { data: payload, userId: user._id });
    const _user = {
      ...user,
      role: payload.role
    };

    TokenStorage.removeAccessToken(_user._id, "undefined");

    TokenStorage.storeAccessToken(res.token, _user._id, _user.role, true);
    TokenStorage.selectAccessToken(_user._id, _user.role);
    yield put(signupSuccessAction(_user));
  } catch (e) {
    yield call(message.error, get(e, "data.message", "Failed to update user please try again."));
  }
}

function* requestNewPasswordSaga({ payload }) {
  try {
    const res = yield call(userApi.requestNewPassword, payload);
    yield put({
      type: REQUEST_NEW_PASSWORD_SUCCESS,
      payload: res
    });
  } catch (e) {
    console.error(e);
    yield call(message.error, e && e.data ? e.data.message : "Failed to request new password.");
    yield put({
      type: REQUEST_NEW_PASSWORD_FAILED
    });
  }
}

function* resetPasswordUserSaga({ payload }) {
  try {
    const res = yield call(userApi.fetchResetPasswordUser, payload);
    if (res) {
      yield put({ type: RESET_PASSWORD_USER_SUCCESS, payload: res });
    } else {
      yield put(push("/login"));
    }
  } catch (e) {
    yield call(message.error, e && e.data ? e.data.message : "Failed to user data.");
    yield put(push("/login"));
  }
}

function* resetPasswordRequestSaga({ payload }) {
  try {
    const result = yield call(userApi.resetUserPassword, payload);
    yield put({ type: RESET_PASSWORD_SUCCESS });
    const user = pick(result, userPickFields);
    TokenStorage.storeAccessToken(result.token, user._id, user.role, true);
    TokenStorage.selectAccessToken(user._id, user.role);
    yield put(signupSuccessAction(result));
    localStorage.removeItem("loginRedirectUrl");
  } catch (e) {
    yield call(message.error, e && e.data ? e.data.message : "Failed to reset password.");
    yield put({
      type: RESET_PASSWORD_FAILED
    });
  }
}

function* resetMyPasswordRequestSaga({ payload }) {
  try {
    yield call(userApi.resetMyPassword, payload);
    yield call(message.success, "Password changed successfully");
    yield put({ type: RESET_MY_PASSWORD_SUCCESS });
  } catch (e) {
    console.error(e);
    yield call(message.error, "Failed to reset password.");
    yield put({
      type: RESET_MY_PASSWORD_FAILED
    });
  }
}

function* updateProfileImageSaga({ payload }) {
  try {
    yield call(userApi.updateUser, payload);
    yield call(message.success, "Thumbnail changed successfully");
    yield put({ type: UPDATE_PROFILE_IMAGE_PATH_SUCCESS, payload: payload.data.thumbnail });
  } catch (e) {
    console.error(e);
    yield call(message.error, "Failed to Update Image");
    yield put({
      type: UPDATE_PROFILE_IMAGE_PATH_FAILED
    });
  }
}
function* updateUserDetailsSaga({ payload }) {
  try {
    const result = yield call(userApi.updateUser, payload);
    yield call(message.success, "User details updated successfully.");
    yield put({ type: UPDATE_USER_DETAILS_SUCCESS, payload: result });
    if (payload.isLogout) {
      yield call(message.success, "Logging Out !");
      yield put({ type: LOGOUT });
    }
  } catch (e) {
    console.error(e);
    yield call(message.error, "Failed to update user details.");
    yield put({
      type: UPDATE_USER_DETAILS_FAILED
    });
  }
}

function* deleteAccountSaga({ payload }) {
  try {
    yield call(userApi.deleteAccount, payload);
    yield call(message.success, "Account deleted successfully.");
    yield put({ type: LOGOUT });
  } catch (e) {
    console.error(e);
    yield call(message.error, "Unable to delete Account");
  }
}

function* updateInterestedCurriculumsSaga({ payload }) {
  try {
    yield call(settingsApi.updateInterestedStandards, payload);
    yield call(message.success, "Standard sets updated successfully.");
    yield put({ type: UPDATE_INTERESTED_CURRICULUMS_SUCCESS, payload: payload.curriculums });
  } catch (e) {
    yield put({ type: UPDATE_INTERESTED_CURRICULUMS_FAILED });
    console.error(e);
    yield call(message.error, "Failed to update Standard sets");
  }
}

function* removeSchoolSaga({ payload }) {
  try {
    yield call(userApi.removeSchool, payload);
    yield call(message.success, "Requested school removed successfully.");
    yield put({ type: REMOVE_SCHOOL_SUCCESS, payload: payload.schoolId });
  } catch (e) {
    yield put({ type: REMOVE_SCHOOL_FAILED });
    console.error(e);
    yield call(message.error, "Failed to remove requested school");
  }
}

function* studentSignupCheckClasscodeSaga({ payload }) {
  try {
    const result = yield call(authApi.validateClassCode, payload.reqData);
  } catch (e) {
    if (payload.errorCallback) {
      payload.errorCallback(e.data.message);
    } else {
      yield call(message.error, e.data.message);
    }
  }
}

function* getInviteDetailsSaga({ payload }) {
  try {
    const result = yield call(authApi.getInvitedUserDetails, payload);
    yield put({ type: GET_INVITE_DETAILS_SUCCESS, payload: result });
  } catch (e) {
    yield put(push("/login"));
  }
}

function* setInviteDetailsSaga({ payload }) {
  try {
    const result = yield call(authApi.updateInvitedUserDetails, payload);

    const user = pick(result, userPickFields);
    TokenStorage.storeAccessToken(result.token, user._id, user.role, true);
    TokenStorage.selectAccessToken(user._id, user.role);

    yield put({ type: SET_INVITE_DETAILS_SUCCESS, payload: result });
  } catch (e) {
    yield call(message.err, "Failed to update user details.");
  }
}

function* getCurrentDistrictUsersSaga({ payload }) {
  try {
    const users = yield call(userApi.fetchUsersFromDistrict, payload);
    yield put(getCurrentDistrictUsersSuccessAction(users));
  } catch (e) {
    yield call(message.error, "Failed to get users from District.");
    console.error(e);
  }
}

function* changeChildSaga({ payload }) {
  try {
  } catch (e) {
    console.error(e);
  }
}

function* updateDefaultSettingsSaga({ payload }) {
  try {
    yield call(settingsApi.updateInterestedStandards, payload);
    yield call(message.success, "Default settings updated successfully.");
    yield put({ type: UPDATE_DEFAULT_SETTINGS_SUCCESS, payload });
  } catch (e) {
    yield put({ type: UPDATE_DEFAULT_SETTINGS_FAILED });
    console.error(e);
    yield call(message.error, "Failed to update default settings.");
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
  yield takeLatest(REQUEST_NEW_PASSWORD_REQUEST, requestNewPasswordSaga);
  yield takeLatest(RESET_PASSWORD_USER_REQUEST, resetPasswordUserSaga);
  yield takeLatest(RESET_PASSWORD_REQUEST, resetPasswordRequestSaga);
  yield takeLatest(STUDENT_SIGNUP_CHECK_CLASSCODE_REQUEST, studentSignupCheckClasscodeSaga);
  yield takeLatest(GET_INVITE_DETAILS_REQUEST, getInviteDetailsSaga);
  yield takeLatest(SET_INVITE_DETAILS_REQUEST, setInviteDetailsSaga);
  yield takeLatest(RESET_MY_PASSWORD_REQUEST, resetMyPasswordRequestSaga);
  yield takeLatest(UPDATE_PROFILE_IMAGE_PATH_REQUEST, updateProfileImageSaga);
  yield takeLatest(UPDATE_USER_DETAILS_REQUEST, updateUserDetailsSaga);
  yield takeLatest(DELETE_ACCOUNT_REQUEST, deleteAccountSaga);
  yield takeLatest(UPDATE_INTERESTED_CURRICULUMS_REQUEST, updateInterestedCurriculumsSaga);
  yield takeLatest(REMOVE_SCHOOL_REQUEST, removeSchoolSaga);
  yield takeLatest(GET_CURRENT_DISTRICT_USERS_REQUEST, getCurrentDistrictUsersSaga);
  yield takeLatest(CHANGE_CHILD, changeChildSaga);
  yield takeLatest(UPDATE_DEFAULT_SETTINGS_REQUEST, updateDefaultSettingsSaga);
}
