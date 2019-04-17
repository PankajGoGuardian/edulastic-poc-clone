import { SET_ELEMENTS_STASH, SET_STASH_INDEX } from "../constants/actions";

export const setElementsStashAction = (data, id) => ({
  type: SET_ELEMENTS_STASH,
  payload: {
    data,
    id
  }
});

export const setStashIndexAction = (data, id) => ({
  type: SET_STASH_INDEX,
  payload: {
    data,
    id
  }
});
