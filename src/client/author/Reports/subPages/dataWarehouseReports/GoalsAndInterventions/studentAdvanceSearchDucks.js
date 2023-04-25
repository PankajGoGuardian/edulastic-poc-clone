import { takeEvery } from 'redux-saga'
import { all, call, put, select } from 'redux-saga/effects'
import moment from 'moment'

import {
  courseApi,
  dataWarehouseApi,
  groupApi,
  reportsApi,
  schoolApi,
} from '@edulastic/api'
import { createAction, createReducer } from 'redux-starter-kit'
import { database } from '@edulastic/constants'
import { notification } from '@edulastic/common'
import { createSelector } from 'reselect'
import { get, isEmpty, omitBy, uniqBy } from 'lodash'
import {
  getUserId,
  getUserOrgData,
  getUserOrgId,
} from '../../../../src/selectors/user'
import { fieldKey } from './component/CreateGroups/AdvancedSearch/config/constants'

const ADVANCED_SEARCH_DETAILS = 'advancedSearchDetails'
const ADVANCED_SEARCH_QUERY = 'advancedSearchQuery'
const ADVANCED_SEARCH_DATA = 'advancedSearchData'
const ADVANCED_SEARCH_LOADING = 'isAdvancedSearchLoading'
const STUDENTS = 'students'
const GROUP = 'group'

// initial values
const initialValue = {
  data: [],
  selected: [],
  isLoading: false,
}
const defaultQuery = { combinator: 'and', rules: [] }

const initialState = {
  [ADVANCED_SEARCH_QUERY]: defaultQuery,
  [ADVANCED_SEARCH_DETAILS]: {
    [fieldKey.schools]: initialValue,
    [fieldKey.courses]: initialValue,
    [fieldKey.classes]: initialValue,
    [fieldKey.performanceBand]: initialValue,
    [fieldKey.attendanceBands]: initialValue,
  },
  [ADVANCED_SEARCH_LOADING]: false,
  [ADVANCED_SEARCH_DATA]: { [STUDENTS]: [] },
  [GROUP]: {
    status: 'init',
    groupDetails: {},
    isLoading: false,
  },
}

// utils
const getUniqOptions = (state) => {
  const fetchedData = state?.data || []
  const selectedData = state?.selected || []
  return uniqBy([...fetchedData, ...selectedData], 'value')
}

// reducer function
const setAdvancedSearchDetails = (state, { payload }) => {
  const { key, data, isAttendanceBand } = payload
  const values = data.map((value) => {
    const name = value.name || value._source?.name || value._source?.tagName
    if (isAttendanceBand) {
      return {
        value: value._id,
        label: name,
        metaData: {
          _id: value._id,
          bands: value.bands,
          levels_min: value.bands.map(({ min }) => min),
        },
      }
    }
    return {
      value: value._id,
      label: name,
    }
  })
  state[ADVANCED_SEARCH_DETAILS][key].data = values
  state[ADVANCED_SEARCH_DETAILS][key].isLoading = false
}
const setAdvancedSearchQuery = (state, { payload }) => {
  if (isEmpty(payload)) {
    state[ADVANCED_SEARCH_QUERY] = initialState[ADVANCED_SEARCH_QUERY]
    state[ADVANCED_SEARCH_DETAILS] = initialState[ADVANCED_SEARCH_DETAILS]
    return
  }
  state[ADVANCED_SEARCH_QUERY] = payload
}
const setAdvanceSearchData = (state, { payload }) => {
  if (isEmpty(payload)) {
    state[ADVANCED_SEARCH_DATA].students =
      initialState[ADVANCED_SEARCH_DATA].students
  }
  state[ADVANCED_SEARCH_DATA][STUDENTS] = payload
  state[ADVANCED_SEARCH_LOADING] = false
}
const setGroupDetails = (state, { payload }) => {
  if (isEmpty(payload)) {
    state.group.groupDetails = {}
  } else {
    state.group.status = 'finished'
  }
  state.group.groupDetails = payload
  state.group.isLoading = false
}

// 1. action names
export const SET_ADVANCED_SEARCH_CLASSES_REQUEST =
  '[goals & interventions] set advanced search classes request'

export const SET_ADVANCED_SEARCH_SCHOOLS_REQUEST =
  '[goals & interventions] set advanced search schools request'

export const SET_ADVANCED_SEARCH_COURSES_REQUEST =
  '[goals & interventions] set advanced search courses request'

export const SET_ADVANCED_SEARCH_ATTENDANCE_BAND_REQUEST =
  '[goals & interventions] set advanced search attendance band request'

export const SET_ADVANCED_SEARCH_PERFORMANCE_BAND_REQUEST =
  '[goals & interventions] set advanced search performance band request'

export const RESET_ADVANCED_SEARCH_DATA =
  '[goals & interventions] reset advanced search data'
export const SET_ADVANCED_SEARCH_DETAILS_SUCCESS =
  '[goals & interventions] set advanced search details success'

export const SET_ADVANCED_SEARCH_QUERY =
  '[goals & interventions] set advanced search query'

export const SET_ADVANCED_SEARCH_DATA_REQUEST =
  '[goals & interventions] set advanced search data request'
export const SET_ADVANCED_SEARCH_DATA_SUCCESS =
  '[goals & interventions] set advanced search data success'

export const RESET_GROUP_STATUS = '[goals & interventions] reset group status'
export const SAVE_GROUP_REQUEST = '[goals & interventions] saving group request'
export const SAVE_GROUP_SUCCESS = '[goals & interventions] saving group success'

// 2. actions
export const setAdvancedSearchClassesAction = createAction(
  SET_ADVANCED_SEARCH_CLASSES_REQUEST
)
export const setAdvancedSearchSchoolsAction = createAction(
  SET_ADVANCED_SEARCH_SCHOOLS_REQUEST
)
export const setAdvancedSearchCoursesAction = createAction(
  SET_ADVANCED_SEARCH_COURSES_REQUEST
)
export const setAdvancedSearchAttendanceAction = createAction(
  SET_ADVANCED_SEARCH_ATTENDANCE_BAND_REQUEST
)
export const setAdvancedSearchPerformanceAction = createAction(
  SET_ADVANCED_SEARCH_PERFORMANCE_BAND_REQUEST
)

export const resetsAdvancedSearchData = createAction(RESET_ADVANCED_SEARCH_DATA)

export const setAdvancedSearchDetailsSuccess = createAction(
  SET_ADVANCED_SEARCH_DETAILS_SUCCESS
)

export const setAdvancedSearchQueryAction = createAction(
  SET_ADVANCED_SEARCH_QUERY
)

export const setAdvancedSearchDataRequest = createAction(
  SET_ADVANCED_SEARCH_DATA_REQUEST
)
export const setAdvancedSearchDataSuccess = createAction(
  SET_ADVANCED_SEARCH_DATA_SUCCESS
)

export const resetGroupStatus = createAction(RESET_GROUP_STATUS)
export const saveGroupRequest = createAction(SAVE_GROUP_REQUEST)

export const saveGroupSuccess = createAction(SAVE_GROUP_SUCCESS)

// 5. reducers
export const goalAndInterventionsReducer = createReducer(initialState, {
  [SET_ADVANCED_SEARCH_CLASSES_REQUEST]: (state) => {
    state[ADVANCED_SEARCH_DETAILS][fieldKey.classes].isLoading = true
  },
  [SET_ADVANCED_SEARCH_SCHOOLS_REQUEST]: (state) => {
    state[ADVANCED_SEARCH_DETAILS][fieldKey.schools].isLoading = true
  },
  [SET_ADVANCED_SEARCH_COURSES_REQUEST]: (state) => {
    state[ADVANCED_SEARCH_DETAILS][fieldKey.courses].isLoading = true
  },
  [SET_ADVANCED_SEARCH_ATTENDANCE_BAND_REQUEST]: (state) => {
    state[ADVANCED_SEARCH_DETAILS][fieldKey.attendanceBands].isLoading = true
  },
  [SET_ADVANCED_SEARCH_PERFORMANCE_BAND_REQUEST]: (state) => {
    state[ADVANCED_SEARCH_DETAILS][fieldKey.performanceBand].isLoading = true
  },
  [RESET_ADVANCED_SEARCH_DATA]: (state) => {
    state[ADVANCED_SEARCH_DATA][STUDENTS] = []
  },
  [SET_ADVANCED_SEARCH_DETAILS_SUCCESS]: setAdvancedSearchDetails,
  [SET_ADVANCED_SEARCH_QUERY]: setAdvancedSearchQuery,
  [SET_ADVANCED_SEARCH_DATA_REQUEST]: (state) => {
    state[ADVANCED_SEARCH_LOADING] = true
  },
  [SET_ADVANCED_SEARCH_DATA_SUCCESS]: setAdvanceSearchData,
  [RESET_GROUP_STATUS]: (state) => {
    state.group.status = 'init'
    state.advancedSearchData.students = []
  },
  [SAVE_GROUP_REQUEST]: (state) => {
    state.group.isLoading = true
  },
  [SAVE_GROUP_SUCCESS]: setGroupDetails,
})

// 6. selectors
export const stateSelector = (state) => state.goalAndInterventionsReducer

export const getAdvancedSearchDetailsSelector = createSelector(
  stateSelector,
  (state) => state[ADVANCED_SEARCH_DETAILS] || {}
)

export const getAdvancedSearchClassesSelector = createSelector(
  getAdvancedSearchDetailsSelector,
  (state) => getUniqOptions(state[fieldKey.classes])
)

export const getAdvancedSearchSchoolsSelector = createSelector(
  getAdvancedSearchDetailsSelector,
  (state) => getUniqOptions(state[fieldKey.schools])
)

export const getAdvancedSearchCoursesSelector = createSelector(
  getAdvancedSearchDetailsSelector,
  (state) => getUniqOptions(state[fieldKey.courses])
)

export const getAdvancedSearchPerformanceBandSelector = createSelector(
  getAdvancedSearchDetailsSelector,
  (state) => getUniqOptions(state[fieldKey.performanceBand])
)
export const getAdvancedSearchAttendanceBandSelector = createSelector(
  getAdvancedSearchDetailsSelector,
  (state) => getUniqOptions(state[fieldKey.attendanceBands])
)

export const isAttendanceBandLoadingSelector = createSelector(
  getAdvancedSearchDetailsSelector,
  (state) => state[fieldKey.attendanceBands].isLoading
)

export const getAdvancedSearchFilterSelector = createSelector(
  stateSelector,
  (state) => state[ADVANCED_SEARCH_QUERY]
)
export const getAdvanceSearchStudentsData = createSelector(
  stateSelector,
  (state) => state[ADVANCED_SEARCH_DATA][STUDENTS]
)

export const isGroupSavingSelector = createSelector(
  stateSelector,
  (state) => state.group.isLoading
)
export const groupStatusSelector = createSelector(
  stateSelector,
  (state) => state.group.status
)
export const isAdvancedSearchLoading = createSelector(
  stateSelector,
  (state) => state[ADVANCED_SEARCH_LOADING]
)

// 4. generator function
function* setAdvancedSearchClasses({ payload }) {
  try {
    const districtId = yield select(getUserOrgId)
    const requestBody = {
      limit: 25,
      page: 1,
      queryType: 'OR',
      includes: ['name'],
      districtId,
      search: {
        institutionIds: [],
        subjects: [],
        grades: [],
        active: [1],
        tags: [],
        name: payload.searchString,
      },
    }

    const response = yield call(groupApi.getGroups, requestBody)
    yield put(
      setAdvancedSearchDetailsSuccess({
        key: fieldKey.classes,
        data: response?.hits || [],
      })
    )
  } catch (error) {
    console.log(error)
    notification({ messageKey: 'somethingWentPleaseTryAgain' })
    yield put(setAdvancedSearchDetailsSuccess({ key: 'classes', data: [] }))
  }
}

function* setAdvancedSearchSchools({ payload }) {
  try {
    const districtId = yield select(getUserOrgId)
    const requestBody = {
      limit: 25,
      districtId,
      search: {
        name: [
          { type: database.MATCH_TYPE.CONTAINS, value: payload.searchString },
        ],
      },
      sortField: 'name',
      order: database.SORT_ORDER.ASC,
    }
    const schools = yield call(schoolApi.getSchools, requestBody)
    yield put(
      setAdvancedSearchDetailsSuccess({
        key: fieldKey.schools,
        data: schools?.data || [],
      })
    )
  } catch (error) {
    console.log(error)

    notification({ messageKey: 'somethingWentPleaseTryAgain' })
    yield put(setAdvancedSearchDetailsSuccess({ key: 'schools', data: [] }))
  }
}
function* setAdvancedSearchCourses({ payload }) {
  try {
    const districtId = yield select(getUserOrgId)
    const requestBody = {
      limit: 25,
      page: 1,
      aggregate: true,
      active: 1,
      includes: ['name'],
      districtId,
      search: {
        name: [
          { type: database.MATCH_TYPE.CONTAINS, value: payload.searchString },
        ],
      },
      sortField: 'name',
      order: database.SORT_ORDER.ASC,
    }

    const response = yield call(courseApi.searchCourse, requestBody)
    const courses = []
    for (const key of Object.keys(response.result)) {
      courses.push({
        _id: response.result[key]?.[0],
        name: key,
      })
    }
    yield put(
      setAdvancedSearchDetailsSuccess({
        key: fieldKey.courses,
        data: courses || [],
      })
    )
  } catch (error) {
    console.log(error)

    notification({ messageKey: 'somethingWentPleaseTryAgain' })
    yield put(setAdvancedSearchDetailsSuccess({ key: 'courses', data: [] }))
  }
}

function* setAdvancedSearchAttendanceBand() {
  try {
    const response = yield call(reportsApi.fetchAttendanceBands)
    if (!isEmpty(response)) {
      yield put(
        setAdvancedSearchDetailsSuccess({
          key: fieldKey.attendanceBands,
          data: response,
          isAttendanceBand: true,
        })
      )
    }
  } catch (error) {
    notification({ messageKey: 'somethingWentPleaseTryAgain' })
    yield put(
      setAdvancedSearchDetailsSuccess({
        key: fieldKey.attendanceBands,
        data: [],
      })
    )
  }
}
// function* setAdvancedSearchPerformanceBand({ payload }) {}
function* setAdvancedSearchData({ payload }) {
  try {
    const { query, paginationDetails } = payload

    const response = yield call(
      dataWarehouseApi.goalsAndInterventionsAdvanceSearchStudents,
      query,
      paginationDetails
    )

    const students = get(response, 'data.result', [])

    if (isEmpty(students)) {
      notification({
        type: 'info',
        msg: `No students are available in current search criteria`,
      })
      return yield put(setAdvancedSearchDataSuccess())
    }
    const { page = 1 } = paginationDetails

    yield put(
      setAdvancedSearchDataSuccess(
        students.map((student) => ({ ...student, page }))
      )
    )
  } catch (error) {
    const errorMessage = `Unable to fetch students's list`
    notification({ type: 'error', msg: errorMessage })
    yield put(setAdvancedSearchDataSuccess())
  }
}

function* saveGroup({ payload }) {
  try {
    const query = yield select(getAdvancedSearchFilterSelector)
    const userId = yield select(getUserId)
    const districtId = yield select(getUserOrgId)
    const userOrgData = yield select(getUserOrgData)
    const groupData = payload
    // default start and end date
    groupData.parent = { id: userId }
    groupData.owners = [userId]
    groupData.type = 'custom'
    const term =
      userOrgData.terms.length &&
      userOrgData.terms.find(
        (t) => t.endDate > Date.now() && t.startDate < Date.now()
      )
    const defaultStartDate = moment()
    const defaultEndDate = term ? term.endDate : defaultStartDate.add(1, 'year')
    groupData.districtId = districtId

    groupData.endDate = moment(defaultEndDate).format('x')
    groupData.startDate = moment(defaultStartDate).format('x')

    const requestBody = omitBy(groupData, (value) => {
      if (typeof value === 'string' && !value.length) {
        return true
      }
      if (Array.isArray(value) && !value.length) {
        return true
      }
      return false
    })

    const response = yield call(dataWarehouseApi.saveGroupdDataWithAdvSearch, {
      groupData: requestBody,
      query,
    })

    yield put(saveGroupSuccess(get(response, 'data.result')))
  } catch (error) {
    const errorMessage = 'Unable to create group'
    notification({ type: 'error', msg: errorMessage })
    yield put(saveGroupSuccess())
  }
}

// 3. saga
export function* goalsAndInterventionsSaga() {
  yield all([
    yield takeEvery(
      SET_ADVANCED_SEARCH_CLASSES_REQUEST,
      setAdvancedSearchClasses
    ),
    yield takeEvery(
      SET_ADVANCED_SEARCH_SCHOOLS_REQUEST,
      setAdvancedSearchSchools
    ),
    yield takeEvery(
      SET_ADVANCED_SEARCH_COURSES_REQUEST,
      setAdvancedSearchCourses
    ),
    yield takeEvery(
      SET_ADVANCED_SEARCH_ATTENDANCE_BAND_REQUEST,
      setAdvancedSearchAttendanceBand
    ),
    // yield takeEvery(
    //   SET_ADVANCED_SEARCH_PERFORMANCE_BAND_REQUEST,
    //   setAdvancedSearchPerformanceBand
    // ),
    yield takeEvery(SET_ADVANCED_SEARCH_DATA_REQUEST, setAdvancedSearchData),
    yield takeEvery(SAVE_GROUP_REQUEST, saveGroup),
  ])
}
