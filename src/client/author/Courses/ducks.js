import { createAction, createReducer } from 'redux-starter-kit'
import { createSelector } from 'reselect'
import { delay } from 'redux-saga'
import { takeEvery, takeLatest, call, put, all } from 'redux-saga/effects'

import { courseApi } from '@edulastic/api'
import { notification } from '@edulastic/common'
import { groupBy, get } from 'lodash'

const RECEIVE_COURSE_REQUEST = '[course] receive data request'
export const RECEIVE_COURSE_SUCCESS = '[course] receive data success'
export const RECEIVE_COURSE_ERROR = '[course] receive data error'
const UPDATE_COURSE_REQUEST = '[course] update data request'
const UPDATE_COURSE_SUCCESS = '[course] update data success'
const UPDATE_COURSE_ERROR = '[course] update data error'
const CREATE_COURSE_REQUEST = '[course] create data request'
const CREATE_COURSE_SUCCESS = '[course] create data success'
const CREATE_COURSE_ERROR = '[course] create data error'
const DEACTIVATE_COURSE_REQUEST = '[course] deactivate data request'
const DEACTIVATE_COURSE_SUCCESS = '[course] deactivate data success'
const DEACTIVATE_COURSE_ERROR = '[course] deactivate data error'
const UPLOAD_COURSE_CSV_REQUEST = '[course] upload CSV request'
const UPLOAD_COURSE_CSV_SUCCESS = '[course] upload CSV success'
const UPLOAD_COURSE_CSV_ERROR = '[course] upload CSV error'

const SET_COURSE_SELECT_ROW_KEY = '[course] set selected row keys'

const SEARCH_COURSE_REQUEST = '[course] search request received'
const SEARCH_COURSE_SUCCESS = '[course] search request success'
const SEARCH_COURSE_ERROR = '[course] search request ERROR'

const REMOVE_UPLOADED_COURSE = '[course] remove selected course of uploaded'

const SAVE_BULK_COURSE_REQUEST = '[course] save bulk course request'
const SAVE_BULK_COURSE_SUCCESS = '[course] save bulk course success'
const SAVE_BULK_COURSE_ERROR = '[course] save bulk course error'

const SET_UPDATEMODAL_PAGE_STATUS = '[course] set update modal page status'

const SET_COURSE_SHOWACTIVE_STATUS = '[course] set show active course status'

const RESET_COURSE_UPLOADMODAL_STATUS = '[course] reset upload modal status'

const RECEIVE_AGGREGATE_COURSE_LIST_SUCCESS =
  '[course] receive aggregate course list success'

export const receiveCourseListAction = createAction(RECEIVE_COURSE_REQUEST)
export const receiveCourseListSuccessAction = createAction(
  RECEIVE_COURSE_SUCCESS
)
export const receiveCourseListErrorAction = createAction(RECEIVE_COURSE_ERROR)
export const updateCourseAction = createAction(UPDATE_COURSE_REQUEST)
export const updateCourseSuccessAction = createAction(UPDATE_COURSE_SUCCESS)
export const updateCourseErrorAction = createAction(UPDATE_COURSE_ERROR)
export const createCourseAction = createAction(CREATE_COURSE_REQUEST)
export const createCourseSuccessAction = createAction(CREATE_COURSE_SUCCESS)
export const createCourseErrorAction = createAction(CREATE_COURSE_ERROR)
export const deactivateCourseAction = createAction(DEACTIVATE_COURSE_REQUEST)
export const deactivateCourseSuccessAction = createAction(
  DEACTIVATE_COURSE_SUCCESS
)
export const deactivateCourseErrorAction = createAction(DEACTIVATE_COURSE_ERROR)
export const uploadCSVAction = createAction(UPLOAD_COURSE_CSV_REQUEST)
export const uploadCSVSuccessAction = createAction(UPLOAD_COURSE_CSV_SUCCESS)
export const uploadCSVErrorAction = createAction(UPLOAD_COURSE_CSV_ERROR)

export const setSelectedRowKeysAction = createAction(SET_COURSE_SELECT_ROW_KEY)

export const receiveSearchCourseAction = createAction(SEARCH_COURSE_REQUEST)

export const removeCourseOfUploadedAction = createAction(REMOVE_UPLOADED_COURSE)

export const saveBulkCourseRequestAction = createAction(
  SAVE_BULK_COURSE_REQUEST
)
export const saveBulkCourseSuccessAction = createAction(
  SAVE_BULK_COURSE_SUCCESS
)
export const saveBulkCourseErrorAction = createAction(SAVE_BULK_COURSE_ERROR)

export const setUpdateModalPageStatusAction = createAction(
  SET_UPDATEMODAL_PAGE_STATUS
)

export const setShowActiveStatusAction = createAction(
  SET_COURSE_SHOWACTIVE_STATUS
)

export const resetUploadModalStatusAction = createAction(
  RESET_COURSE_UPLOADMODAL_STATUS
)

export const receiveAggregateCourseListSuccessAction = createAction(
  RECEIVE_AGGREGATE_COURSE_LIST_SUCCESS
)

// selectors
const stateCourseSelector = (state) => state.coursesReducer
export const getCourseListSelector = createSelector(
  stateCourseSelector,
  (state) => state.data
)

export const getAggregateCourseListSelector = createSelector(
  stateCourseSelector,
  (state) => state.aggregateCourseList || []
)

export const getCoursesForDistrictSelector = createSelector(
  stateCourseSelector,
  (state) => state.searchResult
)

export const getCourseLoading = createSelector(
  stateCourseSelector,
  (state) => state.searching
)

export const getCourseLoadingState = createSelector(
  stateCourseSelector,
  (state) => state.loading
)

// reducers
const initialState = {
  data: [],
  loading: false,
  error: null,
  updating: false,
  updateError: null,
  creating: false,
  createError: null,
  delete: null,
  deleting: false,
  deleteError: null,
  uploadCSV: {},
  uploadingCSV: false,
  uploadCSVError: null,
  selectedRowKeys: [],
  searchResult: [],
  searching: false,
  uploadModalPageStatus: 'normal',
  saveingBulkCourse: false,
  saveBulkCourseError: {},
  totalCourseCount: 0,
  isShowActive: true,
  courseSearchData: {},
  aggregateCourseList: [],
}

export const reducer = createReducer(initialState, {
  [RECEIVE_COURSE_REQUEST]: (state, { payload }) => {
    state.loading = true
    state.courseSearchData = { ...payload }
  },
  [RECEIVE_COURSE_SUCCESS]: (state, { payload }) => {
    state.loading = false
    state.data = payload.result.map((row) => ({ ...row, key: row._id }))
    state.totalCourseCount = payload.totalCourses
  },
  [RECEIVE_COURSE_ERROR]: (state, { payload }) => {
    state.loading = false
    state.error = payload.error
  },
  [UPDATE_COURSE_REQUEST]: (state) => {
    state.updating = true
  },
  [UPDATE_COURSE_SUCCESS]: (state, { payload }) => {
    const courseData = state.data.map((course) => {
      if (course._id === payload._id) {
        const newData = {
          ...payload,
        }
        return { ...course, ...newData }
      }
      return course
    })
    state.updating = false
    state.data = courseData
  },
  [UPDATE_COURSE_ERROR]: (state, { payload }) => {
    state.updating = false
    state.updateError = payload.error
  },
  [CREATE_COURSE_REQUEST]: (state) => {
    state.creating = true
  },
  [CREATE_COURSE_SUCCESS]: (state, { payload }) => {
    state.creating = false
    payload.key = payload._id
    payload.classCount = 0
    const searchData = state.courseSearchData.search
    const keys = Object.keys(searchData)
    let isFitFiltered = true
    for (let i = 0; i < keys.length; i++) {
      if (searchData[keys[i]].type == 'eq') {
        if (
          payload[keys[i]].toString().toLowerCase() !==
          payload[keys[i]].value.toString().toLowerCase()
        ) {
          isFitFiltered = false
          break
        }
      } else if (
        payload[keys[i]]
          .toString()
          .toLowerCase()
          .indexOf(searchData[keys[i]].value.toString().toLowerCase()) < 0
      ) {
        isFitFiltered = false
        break
      }
    }

    const { sortField, order } = state.courseSearchData
    if (isFitFiltered) {
      const newdData = [payload, ...state.data].slice(0, 25)
      state.data = newdData.sort((a, b) => {
        const aValue = a[sortField]
        const bValue = b[sortField]
        let compareValue = 0
        if (aValue.toString().toLowerCase() < bValue.toString().toLowerCase()) {
          compareValue = -1
        } else if (
          aValue.toString().toLowerCase() > bValue.toString().toLowerCase()
        ) {
          compareValue = 1
        }

        if (compareValue != 0) {
          if (order === 'desc') {
            compareValue = -compareValue
          }
        }
        return compareValue
      })
    }
  },
  [CREATE_COURSE_ERROR]: (state, { payload }) => {
    state.createError = payload.error
    state.creating = false
  },
  [DEACTIVATE_COURSE_REQUEST]: (state) => {
    state.deleting = true
  },
  [DEACTIVATE_COURSE_SUCCESS]: (state, { payload }) => {
    state.delete = payload
    state.deleting = false
    const newData = [...state.data]
    const payloadIds = groupBy(payload, 'id')

    if (state.isShowActive) {
      state.data = newData.filter((item) => !payloadIds[item._id])
    } else {
      for (const row of newData) {
        if (payloadIds[row._id]) {
          row.status = 0
        }
      }
      state.data = newData
    }

    state.selectedRowKeys = []
  },
  [DEACTIVATE_COURSE_ERROR]: (state, { payload }) => {
    state.deleting = false
    state.deleteError = payload.error
  },
  [UPLOAD_COURSE_CSV_REQUEST]: (state) => {
    state.uploadingCSV = true
    state.uploadModalPageStatus = 'uploading'
  },
  [UPLOAD_COURSE_CSV_SUCCESS]: (state, { payload }) => {
    state.uploadingCSV = false
    payload.forEach((row, index) => {
      row.key = index
    })
    state.uploadCSV = payload
    state.uploadModalPageStatus = 'uploaded'
  },
  [UPLOAD_COURSE_CSV_ERROR]: (state, { payload }) => {
    state.uploadingCSV = false
    state.uploadCSVError = payload.error
    state.uploadModalPageStatus = 'normal'
  },
  [SET_COURSE_SELECT_ROW_KEY]: (state, { payload }) => {
    state.selectedRowKeys = [...payload]
  },
  [SEARCH_COURSE_REQUEST]: (state) => {
    state.searching = true
  },
  [SEARCH_COURSE_SUCCESS]: (state, { payload }) => {
    state.searching = false
    state.searchResult = payload
  },
  [SEARCH_COURSE_ERROR]: (state, { payload }) => {
    state.searching = false
    state.error = payload
  },
  [REMOVE_UPLOADED_COURSE]: (state, { payload }) => {
    state.uploadCSV = state.uploadCSV.filter((row) => row.key !== payload)
  },
  [SAVE_BULK_COURSE_REQUEST]: (state) => {
    state.saveingBulkCourse = true
  },
  [SAVE_BULK_COURSE_SUCCESS]: (state) => {
    state.saveingBulkCourse = false
    state.uploadModalPageStatus = 'bulk-success'
  },
  [SAVE_BULK_COURSE_ERROR]: (state, { payload }) => {
    state.saveingBulkCourse = false
    state.saveBulkCourseError = payload.error
  },
  [SET_UPDATEMODAL_PAGE_STATUS]: (state, { payload }) => {
    state.uploadModalPageStatus = payload
  },
  [SET_COURSE_SHOWACTIVE_STATUS]: (state, { payload }) => {
    state.isShowActive = payload
  },
  [RESET_COURSE_UPLOADMODAL_STATUS]: (state) => {
    state.saveBulkCourse = false
    state.saveBulkCourseError = []
    state.uploadModalPageStatus = 'normal'
    state.uploadCSV = {}
    state.uploadingCSV = false
    state.uploadCSVError = null
  },
  [RECEIVE_AGGREGATE_COURSE_LIST_SUCCESS]: (state, { payload }) => {
    state.loading = false
    state.aggregateCourseList = payload
  },
})

// sagas
function* receiveCourseListSaga({ payload }) {
  try {
    const response = yield call(courseApi.searchCourse, payload)
    if (payload.aggregate) {
      const courses = []
      for (const [key, value] of Object.entries(response.result)) {
        courses.push({
          _id: value.join('_'),
          name: key,
        })
      }
      yield put(receiveAggregateCourseListSuccessAction(courses))
    } else {
      yield put(receiveCourseListSuccessAction(response))
    }
  } catch (err) {
    const errorMessage = 'Unable to retrieve course list.'
    notification({ type: 'error', msg: errorMessage })
    yield put(receiveCourseListErrorAction({ error: errorMessage }))
  }
}

function* updateCourseSaga({ payload }) {
  try {
    const updateCourse = yield call(courseApi.editCourse, payload.updateData)
    yield put(updateCourseSuccessAction(updateCourse.course))
    notification({ type: 'success', messageKey: 'courseUpdatedSuccessfully' })
  } catch (err) {
    const errorMessage = 'Unable to update course.'
    notification({ type: 'error', msg: errorMessage })
    yield put(updateCourseErrorAction({ error: errorMessage }))
  }
}

function* createCourseSaga({ payload }) {
  try {
    const { success, course, message: errorMessage } = yield call(
      courseApi.saveCourse,
      payload
    )
    if (success) {
      yield put(createCourseSuccessAction(course))
    } else {
      notification({ msg: errorMessage })
      yield put(createCourseErrorAction({ error: errorMessage }))
    }
  } catch (err) {
    const errorMessage = 'Unable to create course.'
    notification({ type: 'error', msg: errorMessage })
    yield put(createCourseErrorAction({ error: errorMessage }))
  }
}

function* deactivateCourseSaga({ payload }) {
  try {
    yield call(courseApi.deactivateCourse, payload)
    yield put(deactivateCourseSuccessAction(payload))
    notification({ type: 'success', messageKey: 'courseDeactivated' })
  } catch (err) {
    const errorMessage = 'Unable to deactivate course.'
    notification({ type: 'error', msg: errorMessage })
    yield put(deactivateCourseErrorAction({ deleteError: errorMessage }))
  }
}
function* uploadCourseCSVSaga({ payload }) {
  try {
    const uploadCSV = yield call(courseApi.uploadcCSV, payload)
    yield put(uploadCSVSuccessAction(uploadCSV))
  } catch (err) {
    const errorMessage = 'Unable to process CSV upload.'
    notification({ type: 'error', msg: errorMessage })
    yield put(deactivateCourseErrorAction({ deleteError: errorMessage }))
  }
}

function* receiveSearchCourseSaga({ payload }) {
  try {
    const course = yield call(courseApi.searchCourse, payload)
    yield put({
      type: SEARCH_COURSE_SUCCESS,
      payload: get(course, 'result', []),
    })
  } catch (error) {
    const errorMessage = 'Unable to retrieve course.'
    notification({ type: 'error', msg: errorMessage })
    yield put({
      type: SEARCH_COURSE_ERROR,
      payload: error,
    })
  }
}

function* saveBulkCourseSaga({ payload }) {
  try {
    const saveBulkCourse = yield call(
      courseApi.saveBulkCourse,
      payload.uploadBulkCourseData
    )
    yield put(saveBulkCourseSuccessAction(saveBulkCourse))
    yield call(delay, 1000)
    yield put(receiveCourseListAction(payload.searchData))
  } catch (err) {
    const errorMessage = 'Saving Bulk Course failing'
    notification({ msg: errorMessage })
    yield put(saveBulkCourseErrorAction({ deleteError: errorMessage }))
  }
}

export function* watcherSaga() {
  yield all([takeLatest(RECEIVE_COURSE_REQUEST, receiveCourseListSaga)])
  yield all([takeEvery(UPDATE_COURSE_REQUEST, updateCourseSaga)])
  yield all([takeEvery(CREATE_COURSE_REQUEST, createCourseSaga)])
  yield all([takeEvery(DEACTIVATE_COURSE_REQUEST, deactivateCourseSaga)])
  yield all([takeEvery(UPLOAD_COURSE_CSV_REQUEST, uploadCourseCSVSaga)])
  yield all([takeLatest(SEARCH_COURSE_REQUEST, receiveSearchCourseSaga)])
  yield all([takeEvery(SAVE_BULK_COURSE_REQUEST, saveBulkCourseSaga)])
}
