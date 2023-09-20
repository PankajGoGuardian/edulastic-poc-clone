import * as moment from 'moment'
import { get, groupBy, keyBy } from 'lodash'
import { createSelector } from 'reselect'
import { createReducer, createAction } from 'redux-starter-kit'
import {
  test as testConst,
  assignmentPolicyOptions,
  roleuser,
  testTypes as testTypesConstants,
} from '@edulastic/constants'
import { takeEvery, all, select, put } from 'redux-saga/effects'
import { getUserRole } from '../src/selectors/user'

export const FETCH_ASSIGNMENTS = '[assignments] fetch assignments'
export const UPDATE_ASSIGNMENT_SETTINGS =
  '[assignment settings] update assignment settings'
export const UPDATE_ASSIGNMENT_SETTINGS_STATE =
  '[assignment settings] update assignment settings state'
export const CLEAR_ASSIGNMENT_SETTINGS =
  '[assignment settings] clear assignment settings'
export const GET_SELECTED_RECOMMENDED_RESOURCES =
  '[assignment settings] get selected recommended resources'

export const fetchAssignmentsAction = (payload) => ({
  type: FETCH_ASSIGNMENTS,
  payload,
})

export const updateAssingnmentSettingsAction = (payload) => ({
  type: UPDATE_ASSIGNMENT_SETTINGS,
  payload,
})

export const updateAssingnmentSettingsStateAction = (payload) => ({
  type: UPDATE_ASSIGNMENT_SETTINGS_STATE,
  payload,
})

export const clearAssignmentSettingsAction = createAction(
  CLEAR_ASSIGNMENT_SETTINGS
)
export const getSelectedResourcesAction = (payload) => ({
  type: GET_SELECTED_RECOMMENDED_RESOURCES,
  payload,
})

// selectors
const _moduld = 'authorTestAssignments'
const currentSelector = (state) => state[_moduld].current

export const testsSelector = (state) => state.tests

export const getAssignmentsSelector = (state) => state[_moduld].assignments

export const testStateSelector = (state) => state.tests

export const getTestSelector = createSelector(
  testStateSelector,
  (state) => state.entity
)

export const getAssignedClassesByIdSelector = createSelector(
  getAssignmentsSelector,
  (assignments) => {
    const assignmentsByTestType = groupBy(assignments, 'testType')
    const {
      COMMON_ASSESSMENT,
      SCHOOL_COMMON_ASSESSMENT,
      ASSESSMENT,
      PRACTICE,
      TESTLET,
      HOMEWORK,
      QUIZ,
    } = testTypesConstants.TEST_TYPES_VALUES_MAP
    const assignedClassesByTestType = {
      [COMMON_ASSESSMENT]: {},
      [SCHOOL_COMMON_ASSESSMENT]: {},
      [ASSESSMENT]: {},
      [PRACTICE]: {},
      [TESTLET]: {},
      [HOMEWORK]: {},
      [QUIZ]: {},
    }
    for (const [key, value] of Object.entries(assignmentsByTestType)) {
      if (
        testTypesConstants.TEST_TYPES.COMMON.includes(key) &&
        !value.archived
      ) {
        const assignedClasses = value
          .flatMap((item) => get(item, 'class', []))
          .filter(
            (item) =>
              item.students &&
              item.students.length === 0 &&
              item.status !== 'ARCHIVED'
          )
        assignedClassesByTestType[key] = keyBy(assignedClasses, '_id') || {}
      }
    }
    return assignedClassesByTestType
  }
)

const classesData = (state) => state.classesReducer.data

export const getClassListSelector = createSelector(classesData, (classes) =>
  Object.values(classes || {}).map((item) => ({
    _id: item._id,
    ...item._source,
  }))
)

export const getCurrentAssignmentSelector = createSelector(
  currentSelector,
  getAssignmentsSelector,
  (current, assignments) => {
    if (current && current !== 'new') {
      const assignment = assignments.filter((item) => item._id === current)[0]
      return assignment
    }
    return {
      startDate: moment(),
      endDate: moment().add('days', 7),
      dueDate: moment().add('days', 7),
      openPolicy: 'Automatically on Start Date',
      closePolicy: 'Automatically on Due Date',
      class: [],
    }
  }
)

export const getTestEntitySelector = createSelector(
  testsSelector,
  (state) => state.entity
)

const statePerformanceBandSelector = (state) => state.performanceBandReducer

export const performanceBandSelector = createSelector(
  statePerformanceBandSelector,
  (performanceBandDistrict) => get(performanceBandDistrict, 'profiles', [])
)

// ======================assingnment settings========================//

const initialState = {
  openPolicy: 'Automatically on Start Date',
  closePolicy: 'Automatically on Due Date',
}

export const assignmentSettings = createReducer(initialState, {
  [UPDATE_ASSIGNMENT_SETTINGS_STATE]: (state, { payload }) => {
    const { userRole, ...rest } = payload
    Object.assign(state, rest)
    if (
      state.passwordPolicy &&
      state.passwordPolicy ===
        testConst.passwordPolicy.REQUIRED_PASSWORD_POLICY_DYNAMIC
    ) {
      state.openPolicy = roleuser.DA_SA_ROLE_ARRAY.includes(userRole)
        ? assignmentPolicyOptions.POLICY_OPEN_MANUALLY_BY_TEACHER
        : assignmentPolicyOptions.POLICY_OPEN_MANUALLY_IN_CLASS
    }
    if (
      state.scoringType === testConst.evalTypeLabels.PARTIAL_CREDIT &&
      !state.penalty
    ) {
      state.scoringType =
        testConst.evalTypeLabels.PARTIAL_CREDIT_IGNORE_INCORRECT
    }
    if (!state.autoRedirect) {
      delete state.autoRedirect
      delete state.autoRedirectSettings
    }
    if (!state.dueDate) {
      delete state.dueDate
    }
  },
  [CLEAR_ASSIGNMENT_SETTINGS]: () => {
    return initialState
  },
  [GET_SELECTED_RECOMMENDED_RESOURCES]: (state, { payload }) => {
    state.resources = payload
  },
})

function* updateAssignmentSettingsSaga({ payload }) {
  const userRole = yield select(getUserRole)
  yield put(updateAssingnmentSettingsStateAction({ ...payload, userRole }))
}

export function* watcherSaga() {
  yield all([
    takeEvery(UPDATE_ASSIGNMENT_SETTINGS, updateAssignmentSettingsSaga),
  ])
}
