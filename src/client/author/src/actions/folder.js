import {
  RECEIVE_FOLDER_REQUEST,
  RECEIVE_FOLDER_CREATE_REQUEST,
  ADD_MOVE_FOLDER_REQUEST,
  DELETE_FOLDER_REQUEST,
  RENAME_FOLDER_REQUEST,
  SET_ITEMS_TO_ADD,
  SET_FOLDER,
  CLEAR_FOLDER,
  TOGGLE_REMOVE_ITEMS_FROM_FOLDER,
  TOGGLE_MOVE_ITEMS_TO_FOLDER,
  REMOVAL_ITEMS_FROM_FOLDER_REQUEST
} from "../constants/actions";

export const receiveFolderAction = payload => ({
  type: RECEIVE_FOLDER_REQUEST,
  payload
});

export const receiveCreateFolderAction = payload => ({
  type: RECEIVE_FOLDER_CREATE_REQUEST,
  payload
});

export const receiveAddMoveFolderAction = payload => ({
  type: ADD_MOVE_FOLDER_REQUEST,
  payload
});

export const receiveDeleteFolderAction = payload => ({
  type: DELETE_FOLDER_REQUEST,
  payload
});

export const receiveRenameFolderAction = payload => ({
  type: RENAME_FOLDER_REQUEST,
  payload
});

export const setFolderAction = payload => ({
  type: SET_FOLDER,
  payload
});

export const clearFolderAction = () => ({
  type: CLEAR_FOLDER
});

export const setItemsMoveFolderAction = payload => ({
  type: SET_ITEMS_TO_ADD,
  payload
});

export const toggleRemoveItemsFolderAction = payload => ({
  type: TOGGLE_REMOVE_ITEMS_FROM_FOLDER,
  payload
});

export const toggleMoveItemsFolderAction = payload => ({
  type: TOGGLE_MOVE_ITEMS_TO_FOLDER,
  payload
});

export const removeItemsFromFolderAction = payload => ({
  type: REMOVAL_ITEMS_FROM_FOLDER_REQUEST,
  payload
});
