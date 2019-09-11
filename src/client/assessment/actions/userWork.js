import { SAVE_USER_WORK, LOAD_SCRATCH_PAD } from "../constants/actions";

export const saveUserWorkAction = payload => ({
  type: SAVE_USER_WORK,
  payload
});

export const loadScratchPadAction = payload => ({
  type: LOAD_SCRATCH_PAD,
  payload
});
