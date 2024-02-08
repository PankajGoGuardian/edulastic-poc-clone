import React from 'react'
import { createReducer, createAction } from 'redux-starter-kit'
import { createSelector } from 'reselect'
import { put, takeEvery, takeLatest, call, all } from 'redux-saga/effects'
import { captureSentryException, notification } from '@edulastic/common'
import { adminApi } from '@edulastic/api'
import { get as _get, isEmpty, omit } from 'lodash'

// CONSTANTS
export const SEARCH_EXISTING_DATA_API = '[admin] SEARCH_EXISTING_DATA_API'
export const APPLY_DELTA_SYNC_CHANGES = '[admin] APPLY_DELTA_SYNC_CHANGES'
export const SYNC_SCHOOLS = '[admin] SYNC_SCHOOLS'
export const SYNC_CLEVER_ORPHAN_USERS = '[admin] SYNC_CLEVER_ORPHAN_USERS'
export const SYNC_EDLINK_ORPHAN_USERS = '[admin] SYNC_EDLINK_ORPHAN_USERS'
export const APPLY_CLASSNAMES_SYNC = '[admin] APPLY_CLASSNAMES_SYNC'
export const ENABLE_DISABLE_SYNC_ACTION = '[admin] ENABLE_DISABLE_SYNC_ACTION'
export const FETCH_CURRICULUM_DATA_ACTION =
  '[admin] FETCH_CURRICULUM_DATA_ACTION'
export const UPDATE_SUBJECT_ACTION = '[admin] UPDATE_OTHER_SUBJECT_ACTION'
export const UPDATE_EDULASTIC_SUBJECT_ACTION =
  '[admin] UPDATE_EDULASTIC_SUBJECT_ACTION'
export const UPDATE_EDULASTIC_STANDARD_ACTION =
  '[admin] UPDATE_EDULASTIC_STANDARD_ACTION'
export const ADD_SUBJECT_STANDARD_ROW_ACTION =
  '[admin] ADD_SUBJECT_STANDARD_ROW_ACTION'
export const UPLOAD_CSV = '[admin] uploading csv file'
export const UPDATE_SUBJECT_STANDARD_MAP = '[admin] UPDATE_SUBJECT_STANDARD_MAP'
export const FETCH_LOGS_DATA = '[admin] FETCH_LOGS_DATA'
export const DELETE_SUBJECT_STANDARD_ROW = '[admin] DELETE_SUBJECT_STANDARD_ROW'

export const FETCH_EXISTING_DATA_SUCCESS = '[admin] FETCH_EXISTING_DATA_SUCCESS'
export const FETCH_CURRICULUM_DATA_SUCCESS =
  '[admin] FETCH_CURRICULUM_DATA_SUCCESS'
export const LOGS_DATA_SUCCESS = '[admin] LOGS_DATA_SUCCESS'
export const LOGS_DATA_FAILED = '[admin] LOGS_DATA_FAILED'
export const RECEIVE_MERGED_ID = '[admin] merg ids to edulastic'
export const CLOSE_MERGE_RESPONSE_TABLE = '[admin] close merge response table'
export const CLEAR_MERGE_DATA = '[admin] clear merge data'
export const SET_STOP_SYNC = '[admin] set stop sync'
export const SET_STOP_SYNC_SAVING_STATUS = '[admin] set stop sync saving status'

export const FETCH_MAPPED_DATA = '[admin] FETCH_MAPPED_DATA'
export const FETCH_MAPPED_DATA_SUCCESS = '[admin] FETCH_MAPPED_DATA_SUCCESS'
export const FETCH_MAPPED_DATA_FAILURE = '[admin] FETCH_MAPPED_DATA_FAILURE'

export const SAVE_APPROVED_MAPPING = '[admin] SAVE_APPROVED_MAPPING'
export const UNSET_MAPPING_DATA = '[admin UNSET_MAPPING_DATA'
export const GENERATE_MAPPED_DATA = '[admin] GENERATE_MAPPED_DATA'
export const SAVE_GENERATE_MAPPING_DATE = '[admin] SAVE_GENERATE_MAPPING_DATE'
export const SAVE_DUPLICATE_MAPPED_DATA = '[admin] SAVE_DUPLICATE_MAPPED_DATA'
export const UNSET_DUPLICATE_MAPPING_DATA =
  '[admin UNSET_DUPLICATE_MAPPING_DATA'

export const TOGGLE_APPROVE_MODAL_VISIBLE =
  '[admin] TOGGLE_APPROVE_MODAL_VISIBLE'

// ACTION CREATORS
export const searchExistingDataApi = createAction(SEARCH_EXISTING_DATA_API)
export const fetchExistingDataSuccess = createAction(
  FETCH_EXISTING_DATA_SUCCESS
)
export const saveGenerateMappingDateAction = createAction(
  SAVE_GENERATE_MAPPING_DATE
)
export const applyDeltaSyncChanges = createAction(APPLY_DELTA_SYNC_CHANGES)
export const syncSchools = createAction(SYNC_SCHOOLS)
export const syncCleverOrphanUsers = createAction(SYNC_CLEVER_ORPHAN_USERS)
export const syncEdlinkOrphanUsers = createAction(SYNC_EDLINK_ORPHAN_USERS)
export const applyClassNamesSync = createAction(APPLY_CLASSNAMES_SYNC)
export const enableDisableSyncAction = createAction(ENABLE_DISABLE_SYNC_ACTION)
export const fetchCurriculumDataAction = createAction(
  FETCH_CURRICULUM_DATA_ACTION
)
export const fetchCurriculumDataSuccess = createAction(
  FETCH_CURRICULUM_DATA_SUCCESS
)
export const updateSubjectAction = createAction(UPDATE_SUBJECT_ACTION)
export const updateEdulasticSubjectAction = createAction(
  UPDATE_EDULASTIC_SUBJECT_ACTION
)
export const updateEdulasticStandardAction = createAction(
  UPDATE_EDULASTIC_STANDARD_ACTION
)
export const addSubjectStandardRowAction = createAction(
  ADD_SUBJECT_STANDARD_ROW_ACTION
)
export const updateSubjectStdMapAction = createAction(
  UPDATE_SUBJECT_STANDARD_MAP
)
export const fetchLogsDataAction = createAction(FETCH_LOGS_DATA)
export const logsDataSuccessAction = createAction(LOGS_DATA_SUCCESS)
export const logsDataFailedAction = createAction(LOGS_DATA_FAILED)
export const deleteSubjectStdMapAction = createAction(
  DELETE_SUBJECT_STANDARD_ROW
)
export const clearMergeDataAction = createAction(CLEAR_MERGE_DATA)

export const uploadCSVAction = createAction(UPLOAD_CSV)
export const receiveMergeIdsAction = createAction(RECEIVE_MERGED_ID)
export const closeMergeResponseAction = createAction(CLOSE_MERGE_RESPONSE_TABLE)
export const setStopSyncAction = createAction(SET_STOP_SYNC)

export const getMappingDataAction = createAction(FETCH_MAPPED_DATA)
export const saveEntityMappingAction = createAction(SAVE_APPROVED_MAPPING)
export const getMappingDataSuccessAction = createAction(
  FETCH_MAPPED_DATA_SUCCESS
)
export const getMappingDataFailureAction = createAction(
  FETCH_MAPPED_DATA_FAILURE
)
export const unSetMappingDataAction = createAction(UNSET_MAPPING_DATA)
export const generateMappedDataAction = createAction(GENERATE_MAPPED_DATA)
export const saveDuplicateMappedDataAction = createAction(
  SAVE_DUPLICATE_MAPPED_DATA
)
export const unSetDuplicateMappingDataAction = createAction(
  UNSET_DUPLICATE_MAPPING_DATA
)
export const toggleApproveModal = createAction(TOGGLE_APPROVE_MODAL_VISIBLE)

// REDUCERS

const initialState = {
  searchData: {},
  subStandardMapping: {
    rows: [],
    subjectStandardMap: {},
    curriculum: {},
    logs: [],
  },
  mergeResponse: {
    data: [],
    showData: false,
  },
  stopSyncSaving: null,
  mappedData: {},
  mappingDataLoading: false,
  loadingData: {
    dId: {
      schoolLoading: true,
      classLoading: false,
    },
  },
  approveModalVisible: false,
}

const putMappedDataIntoState = (state, payload) => {
  const { type, districtId, result, page = 1 } = payload.payload
  const entity = type === 'school' ? 'Schools' : 'Classes'
  state.mappedData[districtId] = state.mappedData[districtId] || {}
  state.mappedData[districtId][entity] =
    state.mappedData[districtId][entity] || {}
  const { totalCount = 0, mappedData = {} } = result
  const data = {
    totalCount,
  }
  if (isEmpty(state.mappedData?.[districtId]?.[entity]?.mappedData)) {
    state.mappedData[districtId][entity].mappedData = {}
  }
  Object.assign(data, state.mappedData[districtId][entity])
  if (type === 'school') {
    data.mappedData = mappedData
  } else {
    if (page === 1) data.mappedData = {}
    data.mappedData[page] = mappedData
    if (totalCount) Object.assign(data, { totalCount })
  }
  state.mappedData[districtId][entity] = data
  state.mappingDataLoading = false
}

const unSetMappingData = (state, payload) => {
  const { type, districtId } = payload.payload
  const entity = type === 'school' ? 'Schools' : 'Classes'
  state.mappedData[districtId] = state.mappedData[districtId] || {}
  state.mappedData[districtId][entity] = {}
}

const putDuplicateMappedDataIntoState = (state, payload) => {
  const { type, result } = payload.payload
  const entity = type === 'school' ? 'Schools' : 'Classes'
  if (!state.duplicateData) state.duplicateData = {}
  state.duplicateData[entity] = result || []
}

const unSetDuplicateMappedData = (state, payload) => {
  const { entity } = payload.payload
  if (state.duplicateData && state.duplicateData[entity])
    state.duplicateData[entity] = []
}

const fetchExistingDataReducer = createReducer(initialState, {
  [CLEAR_MERGE_DATA]: () => initialState,
  [SAVE_GENERATE_MAPPING_DATE]: (state, { payload }) => {
    const mappedDataInfo = state?.searchData?.data?.mappedDataInfo
    const { type, modifiedAt } = payload
    if (mappedDataInfo) {
      state.searchData.data.mappedDataInfo = mappedDataInfo.map((o) => {
        if (type === o._id) {
          return {
            _id: o._id,
            createdAt: modifiedAt.seconds * 1000,
          }
        }
        return o
      })
    }
  },
  [FETCH_EXISTING_DATA_SUCCESS]: (state, { payload }) => {
    const { isClasslink, ...dataPayload } = payload
    const subjectStandardMap = _get(
      dataPayload.data,
      [
        'rosterSyncConfig',
        isClasslink ? 'subjectStandardMap' : 'cleverSubjectStandardMap',
      ],
      {}
    )
    state.searchData = dataPayload
    state.subStandardMapping.subjectStandardMap = subjectStandardMap
    state.subStandardMapping.rows = Object.keys(
      subjectStandardMap
    ).map((key) => ({ subject: key }))
  },
  [FETCH_CURRICULUM_DATA_SUCCESS]: (state, { payload }) => {
    const obj = payload.result.reduce((accumulator, currentValue) => {
      const { subject } = currentValue
      if (accumulator[subject]) {
        accumulator[subject].list.push(currentValue.curriculum)
      } else {
        accumulator[subject] = {}
        accumulator[subject].list = [currentValue.curriculum]
      }
      return accumulator
    }, {})

    state.subStandardMapping.curriculum = obj
  },
  [UPDATE_SUBJECT_ACTION]: (
    state,
    { payload: { index, value, prevValue } }
  ) => {
    const {
      subStandardMapping: { rows, subjectStandardMap },
    } = state
    rows[index].subject = value
    subjectStandardMap[value] = {
      subject: '',
      standard: '',
    }
    delete subjectStandardMap[prevValue]
  },
  [UPDATE_EDULASTIC_SUBJECT_ACTION]: (
    state,
    { payload: { subject, value } }
  ) => {
    const {
      subStandardMapping: { subjectStandardMap },
    } = state
    subjectStandardMap[subject].subject = value
  },
  [UPDATE_EDULASTIC_STANDARD_ACTION]: (
    state,
    { payload: { subject, value } }
  ) => {
    const {
      subStandardMapping: { subjectStandardMap },
    } = state
    subjectStandardMap[subject].standard = value
  },
  [ADD_SUBJECT_STANDARD_ROW_ACTION]: (state) => {
    const {
      subStandardMapping: { rows },
    } = state
    rows.push({ subject: '' })
  },
  [DELETE_SUBJECT_STANDARD_ROW]: (state, { payload: { index, subject } }) => {
    const {
      subStandardMapping: { rows, subjectStandardMap },
    } = state
    rows.splice(index, 1)
    delete subjectStandardMap[subject]
  },
  [FETCH_LOGS_DATA]: (state) => {
    state.subStandardMapping.logsLoading = true
  },
  [LOGS_DATA_SUCCESS]: (state, { payload }) => {
    state.subStandardMapping.logs = payload.result
    state.subStandardMapping.logsLoading = false
  },
  [LOGS_DATA_FAILED]: (state) => {
    state.subStandardMapping.logsLoading = false
  },
  [RECEIVE_MERGED_ID]: (state, { payload: { data, mergeType } }) => {
    state.mergeResponse = {
      data,
      mergeType,
      showData: true,
    }
  },
  [CLOSE_MERGE_RESPONSE_TABLE]: (state) => {
    state.mergeResponse = {
      data: [],
      showData: false,
    }
  },
  [FETCH_MAPPED_DATA]: (state) => {
    state.mappingDataLoading = true
  },
  [FETCH_MAPPED_DATA_SUCCESS]: putMappedDataIntoState,
  [FETCH_MAPPED_DATA_FAILURE]: (state) => {
    state.mappingDataLoading = false
  },
  [SET_STOP_SYNC]: (state) => {
    state.stopSyncSaving = true
  },
  [SET_STOP_SYNC_SAVING_STATUS]: (state, { payload }) => {
    state.stopSyncSaving = payload
  },
  [UNSET_MAPPING_DATA]: unSetMappingData,
  [SAVE_DUPLICATE_MAPPED_DATA]: putDuplicateMappedDataIntoState,
  [UNSET_DUPLICATE_MAPPING_DATA]: unSetDuplicateMappedData,
  [TOGGLE_APPROVE_MODAL_VISIBLE]: (state, { payload }) => {
    state.approveModalVisible = payload
  },
})

// SELECTORS
const adminStateSelector = (state) => state.admin

export const getSearchData = createSelector(
  adminStateSelector,
  ({ mergeData }) => mergeData.searchData
)

export const getSubStandardMapping = createSelector(
  adminStateSelector,
  ({ mergeData }) => mergeData.subStandardMapping
)

export const mergeResponseSelector = createSelector(
  adminStateSelector,
  ({ mergeData }) => mergeData.mergeResponse
)

export const getMappedDataSelector = createSelector(
  adminStateSelector,
  ({ mergeData }) => mergeData.mappedData
)

export const getMappedDataLoading = createSelector(
  adminStateSelector,
  ({ mergeData }) => mergeData.mappingDataLoading
)

export const stopSyncSavingSelector = createSelector(
  adminStateSelector,
  (state) => state.mergeData.stopSyncSaving
)

export const getDuplicateMappedData = createSelector(
  adminStateSelector,
  ({ mergeData }) => mergeData.duplicateData
)

export const getIsApproveModalVisible = createSelector(
  adminStateSelector,
  ({ mergeData }) => mergeData.approveModalVisible
)

// SAGAS
const {
  fetchExistingDataMergeClever,
  fetchExistingDataMergeClasslink,
  applyDeltaSyncApi,
  applyAtlasDeltaSyncApi,
  selectedSchoolSyncApi,
  completeDistrictSync,
  fetchCleverClassNamesSyncApi,
  fetchAtlasClassNamesSyncApi,
  enableDisableCleverSyncApi,
  enableDisableClasslinkSyncApi,
  fetchCurriculumDataApi,
  uploadCSVtoClever,
  uploadCSVtoAtlas,
  updateCleverSubjectStandardApi,
  updateAtlasSubjectStandardApi,
  logsDataApi,
  logsAtlasDataApi,
  selectedAtlasSchoolSyncApi,
  completeAtlasDistrictSync,
  generateMappedData,
  getMappingData,
  saveMappedData,
  syncCleverOrphanUsersApi,
  syncEdlinkOrphanUsersApi,
  cleverStopSyncApi,
  atlasStopSyncApi,
} = adminApi

function* fetchExistingData({ payload }) {
  const { isClasslink } = payload
  try {
    let item
    if (isClasslink) {
      item = yield call(fetchExistingDataMergeClasslink, payload)
    } else {
      item = yield call(fetchExistingDataMergeClever, payload)
    }
    if (item.message) {
      notification({ msg: item.message })
    } else {
      yield put(fetchExistingDataSuccess({ ...item, isClasslink }))
    }
  } catch (err) {
    console.error(err)
    notification({ msg: err?.data?.message || err.message })
  }
}

function* fetchApplyDeltaSync({ payload }) {
  const { isClasslink, ...data } = payload
  try {
    let item
    if (isClasslink) {
      item = yield call(applyAtlasDeltaSyncApi, data)
    } else {
      item = yield call(applyDeltaSyncApi, data)
    }
    if (item.data) {
      notification({ type: 'success', messageKey: 'deltaSyncSucc' })
    }
  } catch (err) {
    console.error(err)
  }
}

function* fetchSchoolsSync({ payload }) {
  let item
  const SYNC_SELECTED_SCHOOLS = 'syncSelectedSchools'
  try {
    const {
      selectedSyncOption,
      isClasslink,
      cleverId,
      atlasId,
      schoolIds,
    } = payload
    if (isClasslink) {
      const dataPayload = {
        atlasId,
        atlasSchoolIds: schoolIds,
      }
      if (selectedSyncOption === SYNC_SELECTED_SCHOOLS) {
        item = yield call(selectedAtlasSchoolSyncApi, dataPayload)
      } else {
        item = yield call(completeAtlasDistrictSync, dataPayload)
      }
    } else {
      const dataPayload = {
        cleverId,
        schoolCleverIds: schoolIds,
      }
      if (selectedSyncOption === SYNC_SELECTED_SCHOOLS) {
        item = yield call(selectedSchoolSyncApi, dataPayload)
      } else {
        item = yield call(completeDistrictSync, dataPayload)
      }
    }
    const {
      result: { success, message: infoMessage },
    } = item
    const messageKey = success ? 'success' : 'error'
    notification({ msg: infoMessage, type: messageKey })
  } catch (err) {
    const {
      data: { message: errMsg },
    } = err.response
    captureSentryException(err)
    notification({ msg: errMsg })
  }
}

function* fetchClassNamesSync({ payload }) {
  try {
    const { isClasslink, ...dataPayload } = payload
    if (isClasslink) {
      yield call(fetchAtlasClassNamesSyncApi, dataPayload)
    } else {
      yield call(fetchCleverClassNamesSyncApi, dataPayload)
    }
    notification({ type: 'success', messageKey: 'classSyncSucc' })
  } catch (err) {
    console.error(err)
  }
}

function* fetchEnableDisableSync({ payload }) {
  try {
    const {
      syncEnabled,
      districtName = '',
      districtId,
      cleverId,
      atlasId,
      isClasslink = false,
    } = payload
    let item
    const newPayload = omit(payload, [
      'districtName',
      'cleverId',
      'atlasId',
      'isClasslink',
    ])
    if (isClasslink) {
      item = yield call(enableDisableClasslinkSyncApi, newPayload)
    } else {
      item = yield call(enableDisableCleverSyncApi, newPayload)
    }
    const searchPayload = { districtId, cleverId, atlasId, isClasslink }
    if (item.success) {
      yield call(fetchExistingData, { payload: searchPayload })
      if (syncEnabled) {
        notification({
          type: 'success',
          msg: `Enabled ${
            isClasslink ? 'Edlink' : 'clever'
          } sync for ${districtName}`,
        })
      } else {
        notification({
          type: 'success',
          msg: `Disabled ${
            isClasslink ? 'Edlink' : 'clever'
          } sync for ${districtName}`,
        })
      }
    } else {
      notification({ msg: item.message })
    }
  } catch (err) {
    console.error(err)
  }
}

function* fetchCurriculumData({ payload }) {
  try {
    const item = yield call(fetchCurriculumDataApi, payload)
    yield put(fetchCurriculumDataSuccess(item))
  } catch (err) {
    console.error(err)
  }
}

function* uploadCSVSaga({ payload }) {
  try {
    const { isClasslink, ...dataPayload } = payload
    let response
    if (isClasslink) {
      response = yield call(uploadCSVtoAtlas, dataPayload)
    } else {
      response = yield call(uploadCSVtoClever, dataPayload)
    }
    const { status = '', message: responseMsg = '', data = [] } = response || {}
    if (status !== 'success') {
      return notification({ msg: responseMsg })
    }
    notification({ type: 'success', msg: responseMsg })
    const { cleverId, atlasId, districtId, mergeType } = payload
    yield put(receiveMergeIdsAction({ data, mergeType }))
    yield put(
      searchExistingDataApi({
        isClasslink,
        districtId,
        atlasId,
        cleverId,
      })
    )
  } catch (err) {
    notification({ messageKey: 'uploadCsvErr' })
  }
}

function* updateSubjectStandardSaga({ payload }) {
  try {
    const { isClasslink, subjectStandardMap, ...dataPayload } = payload
    let item
    if (isClasslink) {
      item = yield call(updateAtlasSubjectStandardApi, {
        ...dataPayload,
        subjectStandardMap,
      })
    } else {
      item = yield call(updateCleverSubjectStandardApi, {
        ...dataPayload,
        cleverSubjectStandardMap: subjectStandardMap,
      })
    }
    if (item.data) {
      notification({ type: 'success', messageKey: 'subjectStandardMapping' })
    }
  } catch (err) {
    console.error(err)
  }
}

function* fetchLogsData({ payload }) {
  try {
    const { isClasslink, districtId } = payload
    let item
    if (isClasslink) {
      item = yield call(logsAtlasDataApi, districtId)
    } else {
      item = yield call(logsDataApi, districtId)
    }
    yield put(logsDataSuccessAction(item))
  } catch (err) {
    yield put(logsDataFailedAction())
    console.error(err)
  }
}

function* generateMappingData({ payload }) {
  try {
    const result = yield call(generateMappedData, payload)
    notification({
      msg: result,
      type: 'success',
    })
  } catch (err) {
    yield put(getMappingDataFailureAction())
    notification({ msg: 'Failed to generate mapping data', type: 'error' })
  }
}

function* getMappedData({ payload }) {
  try {
    const result = yield call(getMappingData, payload)
    yield put(
      getMappingDataSuccessAction({
        type: payload.type,
        districtId: payload.cleverId || payload.atlasId,
        result,
        page: payload.page,
      })
    )
  } catch (err) {
    yield put(getMappingDataFailureAction())
    notification({ msg: 'Failed to get mapped data', type: 'error' })
  }
}

function* saveMappingData({ payload }) {
  const { lmsType } = payload
  const newPayload = omit(payload, ['lmsType'])
  try {
    const result = yield call(saveMappedData, { payload: newPayload, lmsType })
    if (result.statusCode === 409) {
      notification({
        msg: result.message,
        type: 'error',
        exact: true,
        duration: 0,
      })
      if (result.data) {
        yield put(
          saveDuplicateMappedDataAction({
            result: result.data,
            type: payload.type,
          })
        )
      }
    } else {
      notification({ msg: 'Mapped data successfully saved', type: 'success' })
      yield put(toggleApproveModal(false))
    }
  } catch (err) {
    notification({ msg: 'Failed to save mapped data', type: 'error' })
  }
}

function* fetchSyncCleverOrphanUsers({ payload }) {
  let result
  try {
    result = yield call(syncCleverOrphanUsersApi, payload)
    notification({ type: 'success', msg: result })
  } catch (err) {
    console.error(err)
    notification({ msg: err?.data?.message || err.message })
  }
}

function* fetchSyncEdlinkOrphanUsers({ payload }) {
  let result
  try {
    result = yield call(syncEdlinkOrphanUsersApi, payload)
    notification({ type: 'success', msg: result })
  } catch (err) {
    console.error(err)
    notification({ msg: err?.data?.message || err.message })
  }
}

function* setStopSyncSaga({
  payload: { isClasslink, stopSyncData, districtId, schools },
}) {
  try {
    const api = isClasslink ? atlasStopSyncApi : cleverStopSyncApi
    const result = yield call(api, {
      districtId,
      schools: schools.flatMap((s) => {
        return typeof stopSyncData[s.syncKey] === 'undefined'
          ? []
          : [
              {
                ...s,
                stopSync: stopSyncData[s.syncKey],
              },
            ]
      }),
    })
    if (result.success) {
      notification({
        msg: (
          <>
            Stop Sync Success
            <br />
            Updated: {result.nModified}, Created: {result.nUpserted}
          </>
        ),
        type: 'success',
      })
    } else throw new Error(result.message || 'Stop Sync Failed')
  } catch (err) {
    captureSentryException(err)
    notification({ msg: err, type: 'error' })
  } finally {
    yield put({
      type: SET_STOP_SYNC_SAVING_STATUS,
      payload: false,
    })
  }
}

export function* watcherSaga() {
  yield all([
    takeLatest(SEARCH_EXISTING_DATA_API, fetchExistingData),
    takeEvery(APPLY_DELTA_SYNC_CHANGES, fetchApplyDeltaSync),
    takeEvery(SYNC_SCHOOLS, fetchSchoolsSync),
    takeEvery(SYNC_CLEVER_ORPHAN_USERS, fetchSyncCleverOrphanUsers),
    takeEvery(SYNC_EDLINK_ORPHAN_USERS, fetchSyncEdlinkOrphanUsers),
    takeEvery(APPLY_CLASSNAMES_SYNC, fetchClassNamesSync),
    takeEvery(ENABLE_DISABLE_SYNC_ACTION, fetchEnableDisableSync),
    takeLatest(FETCH_CURRICULUM_DATA_ACTION, fetchCurriculumData),
    takeEvery(UPLOAD_CSV, uploadCSVSaga),
    takeEvery(UPDATE_SUBJECT_STANDARD_MAP, updateSubjectStandardSaga),
    takeLatest(FETCH_LOGS_DATA, fetchLogsData),
    takeLatest(FETCH_MAPPED_DATA, getMappedData),
    takeEvery(SAVE_APPROVED_MAPPING, saveMappingData),
    takeEvery(SET_STOP_SYNC, setStopSyncSaga),
    takeEvery(GENERATE_MAPPED_DATA, generateMappingData),
  ])
}

export const sagas = [watcherSaga()]

// ALWAYS EXPORT DEFAULT A REDUCER
export default fetchExistingDataReducer
