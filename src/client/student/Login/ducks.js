import { createAction, createReducer, createSelector } from "redux-starter-kit";
import { pick, last, get, set } from "lodash";
import { takeLatest, call, put, select } from "redux-saga/effects";
import { message } from "antd";
import { push } from "connected-react-router";
import { authApi, userApi, TokenStorage, settingsApi } from "@edulastic/api";
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
export const SIGNUP_SET_POLICY_VIOLATION = "[auth] signup set policy violation";
export const FETCH_USER = "[auth] fetch user";
export const FETCH_V1_REDIRECT = "[v1 redirect] fetch";
export const LOGOUT = "[auth] logout";
export const CHANGE_CLASS = "[student] change class";
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
export const RESET_PASSWORD_REQUEST_STATE = "[auth] reset password request state variable";
export const STUDENT_SIGNUP_CHECK_CLASSCODE_REQUEST = "[auth] student signup check classcode request";
export const STUDENT_SIGNUP_CHECK_CLASSCODE_SUCCESS = "[auth] student signup check classcode success";
export const STUDENT_SIGNUP_CHECK_CLASSCODE_FAILED = "[auth] student signup check classcode failed";
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
export const signupSetPolicyViolationAction = createAction(SIGNUP_SET_POLICY_VIOLATION);
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
export const resetPasswordRequestStateAction = createAction(RESET_PASSWORD_REQUEST_STATE);
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

const initialState = {
  isAuthenticated: false,
  authenticating: true,
  signupStatus: 0
};

const setUser = (state, { payload }) => {
  const defaultGrades =
    getFromLocalStorage("defaultGrades") != null
      ? getFromLocalStorage("defaultGrades")
        ? getFromLocalStorage("defaultGrades").split(",")
        : []
      : null;

  const defaultSubject = getFromLocalStorage("defaultSubject");
  const defaultClass = get(payload, "orgData.classList", []).length > 1 ? "" : get(payload, "orgData.defaultClass");
  state.user = payload;
  state.user.middleName = payload.middleName || undefined;
  state.user.lastName = payload.lastName || undefined;
  set(state.user, "orgData.defaultClass", defaultClass);
  set(state.user, "orgData.selectedGrades", defaultGrades);
  set(state.user, "orgData.selectedSubject", defaultSubject);
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
  [UPDATE_DEFAULT_GRADES]: (state, { payload }) => {
    state.user.orgData.selectedGrades = payload;
  },
  [UPDATE_DEFAULT_SUBJECT]: (state, { payload }) => {
    state.user.orgData.selectedSubject = payload;
  },
  [FETCH_USER]: state => {
    state.isAuthenticated = false;
    state.authenticating = true;
  },
  [FETCH_V1_REDIRECT]: state => {
    state.isAuthenticated = false;
    state.authenticating = true;
  },
  [SET_USER_GOOGLE_LOGGED_IN]: (state, { payload }) => {
    state.user.isUserGoogleLoggedIn = payload;
  },
  [SIGNUP]: state => {
    state.signupPolicyViolation = "";
  },
  [SINGUP_SUCCESS]: setUser,
  [SIGNUP_SET_POLICY_VIOLATION]: (state, { payload }) => {
    state.signupPolicyViolation = payload;
  },
  [STUDENT_SIGNUP_CHECK_CLASSCODE_REQUEST]: (state, { payload }) => {
    state.signupPolicyViolation = "";
  },
  [STUDENT_SIGNUP_CHECK_CLASSCODE_SUCCESS]: (state, { payload }) => {
    state.signupPolicyViolation = "";
  },
  [STUDENT_SIGNUP_CHECK_CLASSCODE_FAILED]: (state, { payload }) => {
    state.signupPolicyViolation = payload;
  },
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
  [RESET_PASSWORD_REQUEST_STATE]: state => {
    state.requestNewPasswordSuccess = false;
  },
  [RESET_PASSWORD_USER_SUCCESS]: (state, { payload }) => {
    state.resetPasswordUser = payload;
  },
  [RESET_PASSWORD_REQUEST]: state => {
    state.requestingNewPassword = true;
  },
  [RESET_PASSWORD_SUCCESS]: (state, { payload }) => {
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
  [RESET_MY_PASSWORD_SUCCESS]: (state, { payload }) => {
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
  }
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
  if (
    (role === "student"
      ? !inputDomain || allowedDomains.includes(inputDomain.toLocaleLowerCase())
      : allowedDomains.includes(inputDomain.toLocaleLowerCase())) ||
    !allowedDomains.length
  ) {
    return true;
  } else {
    return false;
  }
};

function* signup({ payload }) {
  const districtPolicy = yield select(signupDistrictPolicySelector);

  let districtId;
  if (districtPolicy) {
    districtId = districtPolicy.orgId;
  }

  try {
    const { name, email, password, role, classCode, policyViolation } = payload;
    let nameList = name.split(" ");
    nameList = nameList.filter(item => (item && item.trim() ? true : false));
    if (!nameList.length) {
      throw { message: "Please provide your full name." };
    }
    if (!checkEmailPolicy(districtPolicy, role, email)) {
      throw {
        message: policyViolation
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
      role,
      districtId
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
    const msg1 = get(err, "data.message", "");
    const msg2 = get(err, "message", "");
    const msg = msg1 || msg2 || errorMessage;
    if (msg === "Please provide a valid class code.") {
      yield put(signupSetPolicyViolationAction(msg));
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
  } catch (error) {
    console.log(error);
    yield call(message.error, "failed loading user data");
    if (!(error.response && error.response.status === 501)) {
      if (!location.pathname.toLocaleLowerCase().includes(getLoggedOutUrl())) {
        localStorage.setItem("loginRedirectUrl", getCurrentPath());
      }
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

    yield put({
      type: SET_USER,
      payload: user
    });
    let redirectUrl = role === "student" ? "/home/assignments" : "/author/assignments";
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
  const districtPolicy = yield select(signupDistrictPolicySelector);
  let districtId;
  if (districtPolicy) {
    localStorage.setItem("thirdPartySignOnDistrictPolicy", JSON.stringify(districtPolicy));
    districtId = districtPolicy.orgId;
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
  let districtPolicy = localStorage.getItem("thirdPartySignOnDistrictPolicy");
  if (districtPolicy) {
    districtPolicy = JSON.parse(districtPolicy);
    payload.districtId = districtPolicy.orgId;
  }

  try {
    if (payload.edulasticRole === "student") {
      let classCode = localStorage.getItem("thirdPartySignOnClassCode");
      if (classCode) {
        payload.classCode = classCode;
      }
    }
    const res = yield call(authApi.googleSSOLogin, payload);
    yield put(getUserDataAction(res));
  } catch (e) {
    yield call(message.error, get(e, "data.message", "Google Login failed"));
    yield put(push("/login"));
  }
  localStorage.removeItem("thirdPartySignOnRole");
  localStorage.removeItem("thirdPartySignOnClassCode");
  localStorage.removeItem("thirdPartySignOnDistrictPolicy");
}

function* msoLogin({ payload }) {
  const districtPolicy = yield select(signupDistrictPolicySelector);
  let districtId;
  if (districtPolicy) {
    localStorage.setItem("thirdPartySignOnDistrictPolicy", JSON.stringify(districtPolicy));
    districtId = districtPolicy.orgId;
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
  let districtPolicy = localStorage.getItem("thirdPartySignOnDistrictPolicy");
  if (districtPolicy) {
    districtPolicy = JSON.parse(districtPolicy);
    payload.districtId = districtPolicy.orgId;
  }

  try {
    if (payload.edulasticRole === "student") {
      let classCode = localStorage.getItem("thirdPartySignOnClassCode");
      if (classCode) {
        payload.classCode = classCode;
      }
    }
    const res = yield call(authApi.msoSSOLogin, payload);
    yield put(getUserDataAction(res));
  } catch (e) {
    yield call(message.error, get(e, "data.message", "MSO Login failed"));
    yield put(push("/login"));
  }
  localStorage.removeItem("thirdPartySignOnRole");
  localStorage.removeItem("thirdPartySignOnClassCode");
  localStorage.removeItem("thirdPartySignOnDistrictPolicy");
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
    if (payload.role === "student") {
      classCode = localStorage.getItem("thirdPartySignOnClassCode");
      if (classCode) {
        payload.classCode = classCode;
      }
    }
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
    yield put({ type: RESET_PASSWORD_USER_SUCCESS, payload: res });
  } catch (e) {
    yield call(message.error, e && e.data ? e.data.message : "Failed to user data.");
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
    const result = yield call(userApi.resetMyPassword, payload);
    yield call(message.success, "Password changed successfully");
    yield put({ type: RESET_MY_PASSWORD_SUCCESS });
  } catch (e) {
    yield call(message.error, e && e.data ? e.data.message : "Failed to reset password.");
    yield put({
      type: RESET_MY_PASSWORD_FAILED
    });
  }
}

function* updateProfileImageSaga({ payload }) {
  try {
    const result = yield call(userApi.updateUser, payload);
    yield call(message.success, "Thumbnail changed successfully");
    yield put({ type: UPDATE_PROFILE_IMAGE_PATH_SUCCESS, payload: payload.data.thumbnail });
  } catch (e) {
    yield call(message.error, e && e.data ? e.data.message : "Failed to Update Image");
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
  } catch (e) {
    yield call(message.error, e && e.data ? e.data.message : "Update user details failed.");
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
    yield call(message.error, e && e.data ? e.data.message : "Unable to delete Account");
  }
}

function* updateInterestedCurriculumsSaga({ payload }) {
  try {
    const result = yield call(settingsApi.updateInterestedStandards, payload);
    yield call(message.success, "Standard sets updated successfully.");
    yield put({ type: UPDATE_INTERESTED_CURRICULUMS_SUCCESS, payload: result });
  } catch (e) {
    yield put({ type: UPDATE_INTERESTED_CURRICULUMS_FAILED });
    yield call(message.error, e && e.data ? e.data.message : "Failed to update Standard sets");
  }
}

function* removeSchoolSaga({ payload }) {
  try {
    yield call(userApi.removeSchool, payload);
    yield call(message.success, "Requested school removed successfully.");
    yield put({ type: REMOVE_SCHOOL_SUCCESS, payload: payload.schoolId });
  } catch (e) {
    yield put({ type: REMOVE_SCHOOL_FAILED });
    yield call(message.error, e && e.data ? e.data.message : "Failed to remove requested school");
  }
}

function* studentSignupCheckClasscodeSaga({ payload }) {
  try {
    const result = yield call(authApi.validateClassCode, payload);
    yield put({
      type: STUDENT_SIGNUP_CHECK_CLASSCODE_SUCCESS
    });
  } catch (e) {
    console.log(e);
    yield put({
      type: STUDENT_SIGNUP_CHECK_CLASSCODE_FAILED,
      payload: e.data.message
    });
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
}
