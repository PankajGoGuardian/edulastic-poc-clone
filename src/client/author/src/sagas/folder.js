import { takeEvery, call, put, all } from 'redux-saga/effects'
import { folderApi } from '@edulastic/api'
import { get, omit } from 'lodash'
import * as Sentry from '@sentry/browser'
import { captureSentryException, notification } from '@edulastic/common'
import { folderTypes } from '@edulastic/constants'
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
  TOGGLE_REMOVE_ITEMS_FROM_FOLDER,
} from '../constants/actions'

function* receiveGetFoldersRequest({ payload }) {
  try {
    const entities = yield call(folderApi.fetchFolders, payload)
    yield put({
      type: RECEIVE_FOLDER_SUCCESS,
      payload: { entities },
    })
  } catch (error) {
    Sentry.captureException(error)
    const errorMessage = 'Receive folder list failing'
    notification({ msg: errorMessage })
    yield put({
      type: RECEIVE_FOLDER_ERROR,
      payload: { error: errorMessage },
    })
  }
}

function* receiveCreateFolderRequest({ payload }) {
  try {
    const { folderName } = payload
    const entity = yield call(folderApi.createFolder, payload)
    const successMsg = `${folderName} created successfully`
    notification({ type: 'success', msg: successMsg })
    yield put({
      type: RECEIVE_FOLDER_CREATE_SUCCESS,
      payload: { entity },
    })
  } catch (error) {
    Sentry.captureException(error)
    const errorMessage = 'Create folder failing'
    notification({ msg: errorMessage })
    yield put({
      type: RECEIVE_FOLDER_CREATE_ERROR,
      payload: { error: errorMessage },
    })
  }
}

function* receiveAddMoveFolderRequest({ payload }) {
  try {
    const { folderId, params = [], folderType } = payload
    const moveFolderName = params[0].folderName

    let contentName = 'assignment'
    if (folderType === folderTypes.TEST) {
      contentName = 'test'
    } else if (folderType === folderTypes.ITEM) {
      contentName = 'item'
    }
    // item does not have name to show in message
    const list = (params?.[0]?.assignmentsNameList || []).filter((a) => a)
    const showNamesInMsg =
      params.length > 1 || folderType === folderTypes.ITEM
        ? `${params.length || 'Selected'} ${contentName}(s)`
        : `${list.length === 1 ? list[0] : 'Selection'}`

    const successMsg = `${showNamesInMsg} successfully moved to "${moveFolderName}"`

    const folderDetails = params.map((i) =>
      omit(i, ['assignmentsNameList', 'folderName'])
    )
    const result = yield call(folderApi.addMoveContent, {
      folderId,
      data: { content: folderDetails },
    })
    yield put({
      type: ADD_MOVE_FOLDER_SUCCESS,
      payload: { ...result.data, params, updatedFolder: folderId },
    })
    // re-fetch folders from server

    yield put({
      type: RECEIVE_FOLDER_REQUEST,
      payload: folderType,
    })

    notification({ type: 'success', msg: successMsg }) // TODO:Can't be moved to message file since dynamic values wont be supported.
  } catch (error) {
    Sentry.captureException(error)
    const errorMessage = 'Add or Move content to folder failing'
    notification({ msg: errorMessage })
    yield put({
      type: ADD_MOVE_FOLDER_ERROR,
      payload: { error: errorMessage },
    })
  }
}

function* receiveDeleteFolderRequest({ payload }) {
  try {
    const { folderId, delFolderName } = payload
    yield call(folderApi.deleteFolder, folderId)
    const successMsg = `${delFolderName} deleted successfully`
    notification({ type: 'success', msg: successMsg })

    yield put({
      type: DELETE_FOLDER_SUCCESS,
      payload: { folderId },
    })
  } catch (err) {
    captureSentryException(err)
    const errorMessage = 'Delete a folder failing'
    yield put({
      type: DELETE_FOLDER_ERROR,
      payload: { error: errorMessage },
    })
  }
}

function* receiveRenameFolderRequest({ payload }) {
  try {
    const { folderId, folderName, folderType } = payload
    const success = yield call(folderApi.renameFolder, {
      folderId,
      data: { folderName, folderType },
    })
    const successMsg = `Folder name successfully updated to "${folderName}"`
    notification({ type: 'success', msg: successMsg })
    yield put({
      type: RENAME_FOLDER_SUCCESS,
      payload: get(success, 'data.result', null),
    })
  } catch (error) {
    Sentry.captureException(error)
    const errorMessage = 'Rename folder failing'
    notification({ msg: errorMessage })
    yield put({
      type: RENAME_FOLDER_ERROR,
      payload: { error },
    })
  }
}

function* receiveRemoveItemsFromFolder({ payload }) {
  try {
    const { folderId, folderName, itemsToRemove, folderType } = payload
    /**
     * in assignment, we save the test ids.
     * so in case of folderType ASSIGNMENT,
     * contentType will be TEST
     */
    let contentType = folderType
    if (contentType === folderTypes.ASSIGNMENT) {
      contentType = folderTypes.TEST
    }

    let contentName = 'assignment'
    if (folderType === folderTypes.TEST) {
      contentName = 'test'
    } else if (folderType === folderTypes.ITEM) {
      contentName = 'item'
    }

    // item does not have name to show in message
    const showNamesInMsg =
      itemsToRemove.length > 1 || folderType === folderTypes.ITEM
        ? `${itemsToRemove.length} ${contentName}(s)`
        : `${itemsToRemove[0].name}`

    const successMsg = `${showNamesInMsg} successfully removed from "${folderName}"`

    yield call(folderApi.removeItemFromFolder, {
      folderId,
      data: { contentIds: itemsToRemove.map((x) => x.itemId), contentType },
    })

    notification({ type: 'success', msg: successMsg })

    // close removal modal
    yield put({
      type: TOGGLE_REMOVE_ITEMS_FROM_FOLDER,
      payload: {
        items: [],
        isOpen: false,
        updatedFolder: folderId,
      },
    })

    // re-fetch folders from server
    yield put({
      type: RECEIVE_FOLDER_REQUEST,
      payload: folderType,
    })
  } catch (error) {
    const { folderName } = payload
    const errorMessage = `Remove Items from "${folderName}" failing`
    notification({ msg: errorMessage })
    yield put({
      type: REMOVAL_ITEMS_FROM_FOLDER_ERROR,
      payload: error,
    })
  }
}

export default function* watcherSaga() {
  yield all([
    takeEvery(RECEIVE_FOLDER_REQUEST, receiveGetFoldersRequest),
    takeEvery(RECEIVE_FOLDER_CREATE_REQUEST, receiveCreateFolderRequest),
    takeEvery(ADD_MOVE_FOLDER_REQUEST, receiveAddMoveFolderRequest),
    takeEvery(DELETE_FOLDER_REQUEST, receiveDeleteFolderRequest),
    takeEvery(RENAME_FOLDER_REQUEST, receiveRenameFolderRequest),
    takeEvery(REMOVAL_ITEMS_FROM_FOLDER_REQUEST, receiveRemoveItemsFromFolder),
  ])
}
