import { takeEvery, call, put, all } from "redux-saga/effects";
import { folderApi } from "@edulastic/api";
import { message } from "antd";
import {
  RECEIVE_FOLDER_REQUEST,
  RECEIVE_FOLDER_SUCCESS,
  RECEIVE_FOLDER_ERROR,
  RECEIVE_FOLDER_CREATE_REQUEST,
  RECEIVE_FOLDER_CREATE_SUCCESS,
  RECEIVE_FOLDER_CREATE_ERROR,
  ADD_MOVE_FOLDER_REQUEST,
  ADD_MOVE_FOLDER_SUCCESS,
  ADD_MOVE_FOLDER_ERROR,
  DELETE_FOLDER_REQUEST,
  DELETE_FOLDER_SUCCESS,
  DELETE_FOLDER_ERROR
} from "../constants/actions";

function* receiveGetFoldersRequest() {
  try {
    const entities = yield call(folderApi.fetchFolders);
    yield put({
      type: RECEIVE_FOLDER_SUCCESS,
      payload: { entities }
    });
  } catch (error) {
    const errorMessage = "Receive folder list failing";
    yield call(message.error, errorMessage);
    yield put({
      type: RECEIVE_FOLDER_ERROR,
      payload: { error: errorMessage }
    });
  }
}

function* receiveCreateFolderRequest({ payload }) {
  try {
    const entity = yield call(folderApi.createFolder, payload);
    yield put({
      type: RECEIVE_FOLDER_CREATE_SUCCESS,
      payload: { entity }
    });
  } catch (error) {
    const errorMessage = "Create folder failing";
    yield call(message.error, errorMessage);
    yield put({
      type: RECEIVE_FOLDER_CREATE_ERROR,
      payload: { error: errorMessage }
    });
  }
}

function* receiveAddMoveFolderRequest({ payload }) {
  try {
    const { folderId, params = [] } = payload;
    const success = yield call(folderApi.addMoveContent, { folderId, data: { content: params } });
    const successMsg = "Successfully Added or Moved content to folder";
    yield call(message.success, successMsg);
    yield put({
      type: ADD_MOVE_FOLDER_SUCCESS,
      payload: success
    });
  } catch (error) {
    const errorMessage = "Add or Move content to folder failing";
    yield call(message.error, errorMessage);
    yield put({
      type: DELETE_FOLDER_ERROR,
      payload: { error: errorMessage }
    });
  }
}

function* receiveDeleteFolderRequest({ payload }) {
  try {
    const { folderId } = payload;
    const success = yield call(folderApi.deleteFolder, folderId);
    yield call(message.success, success.data.result);

    yield put({
      type: DELETE_FOLDER_SUCCESS,
      payload: { folderId }
    });
  } catch (err) {
    const errorMessage = "Delete a folder failing";
    yield put({
      type: ADD_MOVE_FOLDER_ERROR,
      payload: { error: errorMessage }
    });
  }
}

export default function* watcherSaga() {
  yield all([
    yield takeEvery(RECEIVE_FOLDER_REQUEST, receiveGetFoldersRequest),
    yield takeEvery(RECEIVE_FOLDER_CREATE_REQUEST, receiveCreateFolderRequest),
    yield takeEvery(ADD_MOVE_FOLDER_REQUEST, receiveAddMoveFolderRequest),
    yield takeEvery(DELETE_FOLDER_REQUEST, receiveDeleteFolderRequest)
  ]);
}
