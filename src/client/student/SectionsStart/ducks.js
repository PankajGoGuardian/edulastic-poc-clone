import { createSlice } from 'redux-starter-kit'
import { takeEvery, call, put, all } from 'redux-saga/effects'
import { captureSentryException } from '@edulastic/common'
import { assignmentApi, testActivityApi, testsApi } from '@edulastic/api'
import { createSelector } from 'reselect'
import { keyBy } from 'lodash'

const slice = createSlice({
  name: 'studentSections',
  initialState: {
    isLoading: false,
    testActivity: {},
    error: '',
    isSectionsTestPasswordValidated: false,
    sectionsTestPasswordStatusMessage: '',
  },
  reducers: {
    fetchSectionsData: (state) => {
      state.isSectionsTestPasswordValidated = false
      state.isLoading = true
    },
    fetchSectionsDataSuccess: (state, { payload }) => {
      state.isLoading = false
      state.testActivity = payload
      state.error = ''
    },
    setIsSectionsTestPasswordValidated: (state, { payload }) => {
      state.isSectionsTestPasswordValidated = payload
    },
    setSectionsTestPasswordStatusMessage: (state, { payload }) => {
      state.sectionsTestPasswordStatusMessage = payload
    },
    validateSectionsTestPassword: (state) => {
      state.sectionsTestPasswordStatusMessage = ''
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

function* validateSectionsTestPassword({ payload }) {
  try {
    const { password, assignmentId, groupId } = payload
    const response = yield call(assignmentApi.validateAssignmentPassword, {
      assignmentId,
      password,
      groupId,
    })
    if (response === 'successful') {
      yield put(slice.actions.setIsSectionsTestPasswordValidated(true))
    } else if (response === 'unsuccessful') {
      yield put(
        slice.actions.setSectionsTestPasswordStatusMessage(
          'You have entered an invalid password'
        )
      )
    } else {
      yield put(
        slice.actions.setSectionsTestPasswordStatusMessage('validation failed')
      )
    }
  } catch (err) {
    if (err?.status === 403) {
      yield put(
        slice.actions.setSectionsTestPasswordStatusMessage(
          err.response.data.message
        )
      )
    } else {
      yield put(
        slice.actions.setSectionsTestPasswordStatusMessage('validation failed')
      )
    }
    captureSentryException(err)
  }
}

export function* watcherSaga() {
  yield all([
    yield takeEvery(slice.actions.fetchSectionsData, fetchSectionsData),
    yield takeEvery(
      slice.actions.validateSectionsTestPassword,
      validateSectionsTestPassword
    ),
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

export const getAssignmentSettingsSelector = createSelector(
  getActivityDataSelector,
  (state) => state?.assignmentSettings || {}
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
    const {
      testActivity = {},
      questionActivities = [],
      test,
      itemsToBeExcluded = [],
    } = activity
    const excludeItemsById = keyBy(itemsToBeExcluded)
    const { itemsToDeliverInGroup = [] } = testActivity
    const qActivitiesByTestItemId = keyBy(questionActivities, 'testItemId')
    const itemGroupsById = keyBy(test?.itemGroups, '_id')
    return itemsToDeliverInGroup.map(({ items, ...section }) => {
      return {
        ...section,
        items: items.filter((item) => !excludeItemsById[item]),
        groupName: itemGroupsById[section.groupId]?.groupName,
        skipped: items.reduce((acc, c) => {
          if (
            qActivitiesByTestItemId[c] &&
            qActivitiesByTestItemId[c].skipped
          ) {
            return acc + 1
          }
          return acc
        }, 0),
        attempted: items.reduce((acc, c) => {
          if (
            qActivitiesByTestItemId[c] &&
            !qActivitiesByTestItemId[c].skipped
          ) {
            return acc + 1
          }
          return acc
        }, 0),
      }
    })
  }
)

export const getPasswordValidatedStatusSelector = createSelector(
  stateSelector,
  (state) => state.isSectionsTestPasswordValidated
)

export const getPasswordStatusMessageSelector = createSelector(
  stateSelector,
  (state) => state.sectionsTestPasswordStatusMessage
)
