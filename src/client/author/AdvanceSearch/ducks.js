import { isEmpty } from 'lodash'
import { notification } from '@edulastic/common'
import { createReducer, createAction } from 'redux-starter-kit'
import { createSelector } from 'reselect'
import {
  advanceSearchApi,
  courseApi,
  groupApi,
  schoolApi,
  tagsApi,
} from '@edulastic/api'
import { all, call, put, takeEvery, select } from 'redux-saga/effects'
import { receiveClassListSuccessAction } from '../Classes/ducks'
import { getUserOrgId } from '../src/selectors/user'

// constants
export const IS_ALL_CLASS_SELECTED =
  '[assignment settings] set is all class selected'
export const IS_ADVANCED_SEARCH_SELETED =
  '[assignment settings] set is advanced search query selected'
export const SET_ADVANCED_SEARCH_QUERY =
  '[assignment settings] set advanced search query'
export const SET_ADVANCED_SEARCH_SCHOOLS_REQUEST =
  '[assignment settings] set advanced search schools request'
export const SET_ADVANCED_SEARCH_CLASSES_REQUEST =
  '[assignment settings] set advanced search classes request'
export const SET_ADVANCED_SEARCH_COURSES_REQUEST =
  '[assignment settings] set advanced search courses request'
export const SET_ADVANCED_SEARCH_TAGS_REQUEST =
  '[assignment settings] set advanced search tags request'

export const SET_ADVANCED_SEARCH_DETAILS_SUCCESS =
  '[assignment settings] set advanced search details success'

export const ADVANCED_SEARCH_REQUEST =
  '[assignment settings] advanced search request'
export const ADVANCED_SEARCH_SUCCESS =
  '[assignment settings] advanced search success'

// actions
export const setIsAllClassSelectedAction = (payload) => ({
  type: IS_ALL_CLASS_SELECTED,
  payload,
})

export const setIsAdvancedSearchSelectedAction = (payload) => ({
  type: IS_ADVANCED_SEARCH_SELETED,
  payload,
})

export const setAdvancedSearchFilterAction = (payload) => ({
  type: SET_ADVANCED_SEARCH_QUERY,
  payload,
})

export const setAdvancedSearchSchoolsAction = createAction(
  SET_ADVANCED_SEARCH_SCHOOLS_REQUEST
)

export const setAdvancedSearchClassesAction = createAction(
  SET_ADVANCED_SEARCH_CLASSES_REQUEST
)

export const setAdvancedSearchCoursesAction = createAction(
  SET_ADVANCED_SEARCH_COURSES_REQUEST
)

export const setAdvancedSearchTagsAction = createAction(
  SET_ADVANCED_SEARCH_TAGS_REQUEST
)

export const setAdvancedSearchDetailsAction = createAction(
  SET_ADVANCED_SEARCH_DETAILS_SUCCESS
)

export const advancedSearchRequestAction = createAction(ADVANCED_SEARCH_REQUEST)

export const advancedSearchSuccessAction = createAction(ADVANCED_SEARCH_SUCCESS)

const initialState = {
  isAllClassSelected: false,
  isAdvancedSearchSelected: false,
  advancedSearchQuery: { combinator: 'and', rules: [] },
  advancedSearchDetails: {
    schools: {
      data: [],
      isLoading: false,
    },
    courses: {
      data: [],
      isLoading: false,
    },
    classes: {
      data: [],
      isLoading: false,
    },
    tags: {
      data: [],
      isLoading: false,
    },
  },
  isAdvancedSearchLoading: false,
}

const setAdvancedSearchQuery = (state, { payload }) => {
  if (isEmpty(payload)) {
    state.advancedSearchQuery = initialState.advancedSearchQuery
  } else {
    state.advancedSearchQuery = payload
  }
}

const setIsAllClassSelected = (state, { payload }) => {
  state.isAllClassSelected = payload
}

const setIsAdvancedSearchSelected = (state, { payload }) => {
  state.isAdvancedSearchSelected = payload
}

const setAdvancedSearchDetails = (state, { payload }) => {
  const { key, data } = payload
  const values = data.map((value) => {
    return {
      value: value._id,
      label: value.name || value._source?.name || value._source?.tagName,
    }
  })
  state.advancedSearchDetails[key].data = values
  state.advancedSearchDetails[key].isLoading = false
}

export const reducer = createReducer(initialState, {
  [IS_ALL_CLASS_SELECTED]: setIsAllClassSelected,
  [IS_ADVANCED_SEARCH_SELETED]: setIsAdvancedSearchSelected,
  [SET_ADVANCED_SEARCH_QUERY]: setAdvancedSearchQuery,
  [SET_ADVANCED_SEARCH_SCHOOLS_REQUEST]: (state) => {
    state.advancedSearchDetails.schools.isLoading = true
  },
  [SET_ADVANCED_SEARCH_CLASSES_REQUEST]: (state) => {
    state.advancedSearchDetails.classes.isLoading = true
  },
  [SET_ADVANCED_SEARCH_COURSES_REQUEST]: (state) => {
    state.advancedSearchDetails.courses.isLoading = true
  },
  [SET_ADVANCED_SEARCH_TAGS_REQUEST]: (state) => {
    state.advancedSearchDetails.tags.isLoading = true
  },
  [SET_ADVANCED_SEARCH_DETAILS_SUCCESS]: setAdvancedSearchDetails,
  [ADVANCED_SEARCH_REQUEST]: (state) => {
    state.isAdvancedSearchLoading = true
  },
  [ADVANCED_SEARCH_SUCCESS]: (state) => {
    state.isAdvancedSearchLoading = false
  },
})

// selectors
export const stateSelector = (state) => state.advanceSearchReducer

export const getIsAllClassSelectedSelector = createSelector(
  stateSelector,
  (state) => state.isAllClassSelected
)

export const getIsAdvancedSearchSelectedSelector = createSelector(
  stateSelector,
  (state) => state.isAdvancedSearchSelected
)

export const getAdvancedSearchFilterSelector = createSelector(
  stateSelector,
  (state) => state.advancedSearchQuery
)

export const getAdvancedSearchDetailsSelector = createSelector(
  stateSelector,
  (state) => state.advancedSearchDetails || {}
)

export const getAdvancedSearchSchoolsSelector = createSelector(
  getAdvancedSearchDetailsSelector,
  (state) => state.schools || {}
)

export const getAdvancedSearchClassesSelector = createSelector(
  getAdvancedSearchDetailsSelector,
  (state) => state.classes || {}
)

export const getAdvancedSearchCoursesSelector = createSelector(
  getAdvancedSearchDetailsSelector,
  (state) => state.courses || {}
)

export const getAdvancedSearchTagsSelector = createSelector(
  getAdvancedSearchDetailsSelector,
  (state) => state.tags || {}
)

export const isAdvancedSearchLoadingSelector = createSelector(
  stateSelector,
  (state) => state.isAdvancedSearchLoading || false
)

// saga
function* setAdvancedSearchSchools() {
  try {
    const districtId = yield select(getUserOrgId)
    const schools = yield call(schoolApi.getSchools, { districtId })
    yield put(
      setAdvancedSearchDetailsAction({
        key: 'schools',
        data: schools?.data || [],
      })
    )
  } catch (error) {
    notification({ messageKey: 'somethingWentPleaseTryAgain' })
    yield put(setAdvancedSearchDetailsAction({ key: 'schools', data: [] }))
  }
}

function* setAdvancedSearchClasses({ payload: _payload }) {
  try {
    const districtId = yield select(getUserOrgId)
    const payload = {
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
        name: _payload.searchString,
      },
    }

    const response = yield call(groupApi.getGroups, payload)
    yield put(
      setAdvancedSearchDetailsAction({
        key: 'classes',
        data: response?.hits || [],
      })
    )
  } catch (error) {
    notification({ messageKey: 'somethingWentPleaseTryAgain' })
    yield put(setAdvancedSearchDetailsAction({ key: 'classes', data: [] }))
  }
}

function* setAdvancedSearchCourses({ payload: _payload }) {
  try {
    const districtId = yield select(getUserOrgId)
    const payload = {
      limit: 25,
      page: 1,
      aggregate: true,
      active: 1,
      includes: ['name'],
      districtId,
      search: {
        name: [{ type: 'cont', value: _payload.searchString }],
      },
    }

    const response = yield call(courseApi.searchCourse, payload)
    const courses = []
    for (const key of Object.keys(response.result)) {
      courses.push({
        _id: key,
        name: key,
      })
    }
    yield put(
      setAdvancedSearchDetailsAction({
        key: 'courses',
        data: courses || [],
      })
    )
  } catch (error) {
    notification({ messageKey: 'somethingWentPleaseTryAgain' })
    yield put(setAdvancedSearchDetailsAction({ key: 'courses', data: [] }))
  }
}

function* setAdvancedSearchTags({ payload: _payload }) {
  try {
    const districtId = yield select(getUserOrgId)
    const payload = {
      page: 1,
      search: {
        searchString: [_payload.searchString],
        tagTypes: ['group'],
        districtIds: [districtId],
      },
    }
    const tags = yield call(tagsApi.searchTags, payload)
    yield put(
      setAdvancedSearchDetailsAction({
        key: 'tags',
        data: tags?.hits?.hits || [],
      })
    )
  } catch (error) {
    notification({ messageKey: 'somethingWentPleaseTryAgain' })
    yield put(setAdvancedSearchDetailsAction({ key: 'tags', data: [] }))
  }
}

function* advancedSearchRequest({ payload }) {
  try {
    const { query } = payload
    const hits = yield call(advanceSearchApi.advancedSearch, query)
    yield put(receiveClassListSuccessAction(hits))
  } catch (error) {
    const errorMessage = 'Unable to fetch current class information.'
    notification({ type: 'error', msg: errorMessage })
  } finally {
    yield put(advancedSearchSuccessAction())
  }
}

export function* watcherSaga() {
  yield all([
    yield takeEvery(
      SET_ADVANCED_SEARCH_SCHOOLS_REQUEST,
      setAdvancedSearchSchools
    ),
    yield takeEvery(
      SET_ADVANCED_SEARCH_CLASSES_REQUEST,
      setAdvancedSearchClasses
    ),
    yield takeEvery(
      SET_ADVANCED_SEARCH_COURSES_REQUEST,
      setAdvancedSearchCourses
    ),
    yield takeEvery(SET_ADVANCED_SEARCH_TAGS_REQUEST, setAdvancedSearchTags),
    yield takeEvery(ADVANCED_SEARCH_REQUEST, advancedSearchRequest),
  ])
}
