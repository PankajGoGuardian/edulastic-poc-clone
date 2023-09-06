import { createSlice } from 'redux-starter-kit'
import { takeEvery, call, put, all } from 'redux-saga/effects'
import { testActivityApi, testsApi } from '@edulastic/api'
import { createSelector } from 'reselect'
import { keyBy } from 'lodash'

const slice = createSlice({
  name: 'studentSections',
  initialState: {
    isLoading: false,
    testActivity: {},
    error: '',
  },
  reducers: {
    fetchSectionsData: (state) => {
      state.isLoading = true
    },
    fetchSectionsDataSuccess: (state, { payload }) => {
      state.isLoading = false
      state.testActivity = payload
      state.error = ''
    },
  },
})

export { slice }

function* fetchSectionsData({ payload }) {
  try {
    const { utaId, groupId, studentAssesment = true } = payload
    const response = yield call(
      testActivityApi.getById,
      utaId,
      groupId,
      studentAssesment
    )
    const assignmentId = response.testActivity.assignmentId
    const testId = response.testActivity.testId
    const playlistId = response.testActivity.playlistId
    const test = yield call(testsApi.getByIdMinimal, testId, {
      validation: true,
      data: true,
      groupId,
      testActivityId: utaId,
      playlistId,
      assignmentId,
    })
    response.test = test
    yield put(slice.actions.fetchSectionsDataSuccess(response))
  } catch (err) {
    console.error('ERROR WHILE FETCHING STUDENT SECTION DETAILS : ', err)
  }
}

export function* watcherSaga() {
  yield all([
    yield takeEvery(slice.actions.fetchSectionsData, fetchSectionsData),
  ])
}

const stateSelector = (state) => state.studentSections

export const getIsLoadingSelector = createSelector(
  stateSelector,
  (state) => state.isLoading
)

export const getActivityDataSelector = createSelector(
  stateSelector,
  (state) => state.testActivity || {}
)

export const getTestDataSelector = createSelector(
  getActivityDataSelector,
  (activity) => activity?.test || {}
)

export const getPreventSectionNavigationSelector = createSelector(
  getTestDataSelector,
  (test) => test?.preventSectionNavigation
)

export const getItemstoDeliverWithAttemptCount = createSelector(
  getActivityDataSelector,
  (activity) => {
    const { testActivity = {}, questionActivities = [], test } = activity
    const { itemsToDeliverInGroup = [] } = testActivity
    const qActivitiesByTestItemId = keyBy(questionActivities, 'testItemId')
    const itemGroupsById = keyBy(test?.itemGroups, '_id')
    return itemsToDeliverInGroup.map(({ items, ...section }) => {
      return {
        ...section,
        items,
        groupName: itemGroupsById[section.groupId]?.groupName,
        attempted: items.reduce((acc, c) => {
          if (qActivitiesByTestItemId[c]) {
            return acc + 1
          }
          return acc + 0
        }, 0),
      }
    })
  }
)
