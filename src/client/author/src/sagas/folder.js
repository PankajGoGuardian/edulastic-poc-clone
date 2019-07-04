import { takeEvery, call, put, all } from "redux-saga/effects";
import { folderApi } from "@edulastic/api";
import { get, omit } from "lodash";
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
  DELETE_FOLDER_ERROR,
  RENAME_FOLDER_REQUEST,
  RENAME_FOLDER_SUCCESS,
  RENAME_FOLDER_ERROR
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
    const { folderName } = payload;
    const entity = yield call(folderApi.createFolder, payload);
    const successMsg = `${folderName} created successfully`;
    yield call(message.success, successMsg);
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
    const assignmentNamesCount = params[0].assignmentsNameList.length || 0;
    const showNamesInMsg =
      assignmentNamesCount > 1 ? `${assignmentNamesCount} assignments were` : `${params[0].assignmentsNameList} was`;
    const moveFolderName = params[0].folderName;
    const folderDetails = params.map(i => omit(i, ["assignmentsNameList", "folderName"]));

    const result = yield call(folderApi.addMoveContent, { folderId, data: { content: folderDetails } });
    const successMsg = `${showNamesInMsg} successfully moved to ${moveFolderName} folder`;
    yield call(message.success, successMsg);
    yield put({
      type: ADD_MOVE_FOLDER_SUCCESS,
      payload: result.data
    });
  } catch (error) {
    const errorMessage = "Add or Move content to folder failing";
    yield call(message.error, errorMessage);
    yield put({
      type: ADD_MOVE_FOLDER_ERROR,
      payload: { error: errorMessage }
    });
  }
}

function* receiveDeleteFolderRequest({ payload }) {
  try {
    const { folderId, delFolderName } = payload;
    yield call(folderApi.deleteFolder, folderId);
    const successMsg = `${delFolderName} deleted successfully`;
    yield call(message.success, successMsg);

    yield put({
      type: DELETE_FOLDER_SUCCESS,
      payload: { folderId }
    });
  } catch (err) {
    const errorMessage = "Delete a folder failing";
    yield put({
      type: DELETE_FOLDER_ERROR,
      payload: { error: errorMessage }
    });
  }
}

function* receiveRenameFolderRequest({ payload }) {
  try {
    const { folderId, folderName } = payload;
    const success = yield call(folderApi.renameFolder, { folderId, data: { folderName } });
    const successMsg = `Folder name successfully updated to "${folderName}"`;
    yield call(message.success, successMsg);
    yield put({
      type: RENAME_FOLDER_SUCCESS,
      payload: get(success, "data.result", null)
    });
  } catch (error) {
    const errorMessage = "Rename folder failing";
    yield call(message.error, errorMessage);
    yield put({
      type: RENAME_FOLDER_ERROR,
      payload: { error }
    });
  }
}

export default function* watcherSaga() {
  yield all([
    yield takeEvery(RECEIVE_FOLDER_REQUEST, receiveGetFoldersRequest),
    yield takeEvery(RECEIVE_FOLDER_CREATE_REQUEST, receiveCreateFolderRequest),
    yield takeEvery(ADD_MOVE_FOLDER_REQUEST, receiveAddMoveFolderRequest),
    yield takeEvery(DELETE_FOLDER_REQUEST, receiveDeleteFolderRequest),
    yield takeEvery(RENAME_FOLDER_REQUEST, receiveRenameFolderRequest)
  ]);
}
