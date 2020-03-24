import { SET_TEST_LEVEL_USER_WORK, SAVE_TEST_LEVEL_USER_WORK, SAVE_TESTLET_LOG } from "../constants/actions";

export const setTestUserWorkAction = payload => ({
  type: SET_TEST_LEVEL_USER_WORK, // store to redux
  payload
});

export const saveTestletStateAction = () => ({
  type: SAVE_TEST_LEVEL_USER_WORK // store to db
});

export const saveTestletLogAction = log => ({
  type: SAVE_TESTLET_LOG,
  payload: log
});
