import { createAction, createReducer, createSelector } from "redux-starter-kit";
import { pick, last } from "lodash";
import { takeLatest, call, put, select } from "redux-saga/effects";
import { message } from "antd";
import { push } from "react-router-redux";
import { authApi, userApi, TokenStorage } from "@edulastic/api";
import { roleuser, signUpState } from "@edulastic/constants";
import { fetchAssignmentsAction } from "../Assignments/ducks";
import { fetchSkillReportByClassID as fetchSkillReportAction } from "../SkillReport/ducks";
import { receiveLastPlayListAction, receiveRecentPlayListsAction } from "../../author/Playlist/ducks";

// types
export const LOGIN = "[auth] login";
export const SET_USER = "[auth] set user";
export const SIGNUP = "[auth] signup";
export const SINGUP_SUCCESS = "[auth] signup success";
export const FETCH_USER = "[auth] fetch user";
export const LOGOUT = "[auth] logout";
export const CHANGE_CLASS = "[student] change class";
export const LOAD_SKILL_REPORT_BY_CLASSID = "[reports] load skill report by class id";

// actions
export const loginAction = createAction(LOGIN);
export const setUserAction = createAction(SET_USER);
export const signupAction = createAction(SIGNUP);
export const signupSuccessAction = createAction(SINGUP_SUCCESS);
export const fetchUserAction = createAction(FETCH_USER);
export const logoutAction = createAction(LOGOUT);
export const changeClassAction = createAction(CHANGE_CLASS);

const initialState = {
  isAuthenticated: false,
  authenticating: true,
  signupStatus: 0
};

const setUser = (state, { payload }) => {
  state.user = payload;
  state.isAuthenticated = true;
  state.authenticating = false;
  state.signupStatus = payload.currentSignUpState;
};

const getCurrentPath = () => {
  const { location } = window;
  return `${location.pathname}${location.search}${location.hash}`;
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
    const user = pick(result, ["_id", "firstName", "lastName", "email", "role", "orgData", "features"]);
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
    } else if (user.role === roleuser.STUDENT) {
      yield put(push("/home/assignments"));
    } else if (user.role === roleuser.ADMIN) {
      yield put(push("/admin"));
    } else yield put(push("/author/assignments"));
  } catch (err) {
    console.error(err);
    const errorMessage = "Invalid username or password";
    yield call(message.error, errorMessage);
  }
}

function* signup({ payload }) {
  try {
    const { name, email, password, role } = payload;
    const nameList = name.split(" ");
    let firstName;
    let lastName;
    let middleName;
    if (nameList.length > 2) {
      firstName = nameList.slice(0, -1).join(" ");
      middleName = nameList.slice(1, -1).join(" ");
      lastName = last(nameList);
    } else if (nameList.length > 1) {
      lastName = last(nameList);
      firstName = nameList.slice(0, -1).join(" ");
    } else {
      firstName = name;
    }
    const obj = {
      password,
      email,
      firstName,
      middleName,
      lastName,
      role
    };
    const response = yield call(authApi.signup, obj);
    const { message: _responseMsg, result } = response;
    if (_responseMsg && !result) {
      yield call(message.error, _responseMsg);
    } else {
      const user = pick(result, ["_id", "firstName", "lastName", "email", "role", "orgData", "currentSignUpState"]);
      TokenStorage.storeAccessToken(result.token, user._id, user.role, true);
      TokenStorage.selectAccessToken(user._id, user.role);
      yield put(signupSuccessAction(result));
      localStorage.removeItem("loginRedirectUrl");
      if (user.role === roleuser.TEACHER) {
        switch (user.currentSignUpState) {
          case signUpState.SCHOOL_NOT_SELECTED:
            yield put(push("/signup"));
            break;
          case signUpState.PREFERENCE_NOTSELECTED:
            yield put(push("/signup"));
            break;
          case signUpState.DONE:
            yield put(push("/author/assignments"));
            break;
          default:
            yield put(push("/author/assignments"));
        }
      }
    }
  } catch (err) {
    console.error(err);
    const errorMessage = "Email already exist";
    yield call(message.error, errorMessage);
  }
}

export function* fetchUser() {
  try {
    // TODO: handle the case of invalid token
    if (!TokenStorage.getAccessToken()) {
      localStorage.setItem("loginRedirectUrl", getCurrentPath());
      yield put(push("/login"));
      return;
    }
    const user = yield call(userApi.getUser);
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
    window.localStorage.setItem("loginRedirectUrl", getCurrentPath());
    yield put(push("/login"));
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

export function* watcherSaga() {
  yield takeLatest(LOGIN, login);
  yield takeLatest(SIGNUP, signup);
  yield takeLatest(LOGOUT, logout);
  yield takeLatest(FETCH_USER, fetchUser);
  yield takeLatest(CHANGE_CLASS, changeClass);
}
