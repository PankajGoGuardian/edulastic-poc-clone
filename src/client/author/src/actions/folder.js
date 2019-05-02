import {
  RECEIVE_FOLDER_REQUEST,
  RECEIVE_FOLDER_CREATE_REQUEST,
  ADD_MOVE_FOLDER_REQUEST,
  DELETE_FOLDER_REQUEST
} from "../constants/actions";

export const receiveFolderAction = () => ({
  type: RECEIVE_FOLDER_REQUEST
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
