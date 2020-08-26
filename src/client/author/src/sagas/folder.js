import { takeEvery, call, put, all } from "redux-saga/effects";
import { folderApi } from "@edulastic/api";
import { get, omit } from "lodash";
import * as Sentry from "@sentry/browser";
import { notification } from "@edulastic/common";
import { folderTypes } from "@edulastic/constants";
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
  RENAME_FOLDER_ERROR,
  REMOVAL_ITEMS_FROM_FOLDER_REQUEST,
  REMOVAL_ITEMS_FROM_FOLDER_ERROR,
  TOGGLE_REMOVE_ITEMS_FROM_FOLDER
} from "../constants/actions";

function* receiveGetFoldersRequest({ payload }) {
  try {
    const entities = yield call(folderApi.fetchFolders, payload);
    yield put({
      type: RECEIVE_FOLDER_SUCCESS,
      payload: { entities }
    });
  } catch (error) {
    Sentry.captureException(error);
    const errorMessage = "Receive folder list failing";
    notification({ msg: errorMessage });
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
    notification({ type: "success", msg: successMsg });
    yield put({
      type: RECEIVE_FOLDER_CREATE_SUCCESS,
      payload: { entity }
    });
  } catch (error) {
    Sentry.captureException(error);
    const errorMessage = "Create folder failing";
    notification({ msg: errorMessage });
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
    yield put({
      type: ADD_MOVE_FOLDER_SUCCESS,
      payload: { ...result.data, params }
    });
    const successMsg = `${showNamesInMsg} successfully moved to ${moveFolderName} folder`;
    notification({ type: "success", msg: successMsg }); // TODO:Can't be moved to message file since dynamic values wont be supported.
  } catch (error) {
    Sentry.captureException(error);
    const errorMessage = "Add or Move content to folder failing";
    notification({ msg: errorMessage });
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
    notification({ type: "success", msg: successMsg });

    yield put({
      type: DELETE_FOLDER_SUCCESS,
      payload: { folderId }
    });
  } catch (err) {
    Sentry.captureException(err);
    const errorMessage = "Delete a folder failing";
    yield put({
      type: DELETE_FOLDER_ERROR,
      payload: { error: errorMessage }
    });
  }
}

function* receiveRenameFolderRequest({ payload }) {
  try {
    const { folderId, folderName, folderType } = payload;
    const success = yield call(folderApi.renameFolder, { folderId, data: { folderName, folderType } });
    const successMsg = `Folder name successfully updated to "${folderName}"`;
    notification({ type: "success", msg: successMsg });
    yield put({
      type: RENAME_FOLDER_SUCCESS,
      payload: get(success, "data.result", null)
    });
  } catch (error) {
    Sentry.captureException(error);
    const errorMessage = "Rename folder failing";
    notification({ msg: errorMessage });
    yield put({
      type: RENAME_FOLDER_ERROR,
      payload: { error }
    });
  }
}

function* receiveRemoveItemsFromFolder({ payload }) {
  try {
    const { folderId, folderName, itemsToRemove, folderType } = payload;
    /**
     * in assignment, we save the test ids.
     * so in case of folderType ASSIGNMENT,
     * contentType will be TEST
     */
    let contentType = folderType;
    if (contentType === folderTypes.ASSIGNMENT) {
      contentType = folderTypes.TEST;
    }

    yield all(
      itemsToRemove.map(contentId =>
        call(folderApi.removeItemFromFolder, { folderId, data: { contentId, contentType } })
      )
    );

    notification({ type: "success", msg: `Items successfully removed from "${folderName}"` });

    // close removal modal
    yield put({
      type: TOGGLE_REMOVE_ITEMS_FROM_FOLDER,
      payload: {
        items: [],
        isOpen: false
      }
    });

    // re-fetch folders from server
    yield put({
      type: RECEIVE_FOLDER_REQUEST,
      payload: folderType
    });
  } catch (error) {
    const { folderName } = payload;
    const errorMessage = `Remove Items from "${folderName}" failing`;
    notification({ msg: errorMessage });
    yield put({
      type: REMOVAL_ITEMS_FROM_FOLDER_ERROR,
      payload: error
    });
  }
}

export default function* watcherSaga() {
  yield all([
    yield takeEvery(RECEIVE_FOLDER_REQUEST, receiveGetFoldersRequest),
    yield takeEvery(RECEIVE_FOLDER_CREATE_REQUEST, receiveCreateFolderRequest),
    yield takeEvery(ADD_MOVE_FOLDER_REQUEST, receiveAddMoveFolderRequest),
    yield takeEvery(DELETE_FOLDER_REQUEST, receiveDeleteFolderRequest),
    yield takeEvery(RENAME_FOLDER_REQUEST, receiveRenameFolderRequest),
    yield takeEvery(REMOVAL_ITEMS_FROM_FOLDER_REQUEST, receiveRemoveItemsFromFolder)
  ]);
}
