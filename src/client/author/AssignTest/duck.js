import * as moment from 'moment'
import { get, groupBy, keyBy } from 'lodash'
import { createSelector } from 'reselect'
import { createReducer, createAction } from 'redux-starter-kit'
import {
  test as testConst,
  assignmentPolicyOptions,
} from '@edulastic/constants'

export const FETCH_ASSIGNMENTS = '[assignments] fetch assignments'
export const UPDATE_ASSIGNMENT_SETTINGS =
  '[assignment settings] update assignment settings'
export const CLEAR_ASSIGNMENT_SETTINGS =
  '[assignment settings] clear assignment settings'

export const fetchAssignmentsAction = (payload) => ({
  type: FETCH_ASSIGNMENTS,
  payload,
})

export const updateAssingnmentSettingsAction = (payload) => ({
  type: UPDATE_ASSIGNMENT_SETTINGS,
  payload,
})
export const clearAssignmentSettingsAction = createAction(
  CLEAR_ASSIGNMENT_SETTINGS
)

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
    const { COMMON, ASSESSMENT, PRACTICE, TESTLET } = testConst.type
    const assignedClassesByTestType = {
      [COMMON]: {},
      [ASSESSMENT]: {},
      [PRACTICE]: {},
      [TESTLET]: {},
    }
    for (const [key, value] of Object.entries(assignmentsByTestType)) {
      if (key === COMMON && !value.archived) {
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
  [UPDATE_ASSIGNMENT_SETTINGS]: (state, { payload }) => {
    Object.assign(state, payload)
    if (
      state.passwordPolicy &&
      state.passwordPolicy ===
        testConst.passwordPolicy.REQUIRED_PASSWORD_POLICY_DYNAMIC
    ) {
      state.openPolicy = assignmentPolicyOptions.POLICY_OPEN_MANUALLY_IN_CLASS
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
  },
  [CLEAR_ASSIGNMENT_SETTINGS]: () => {
    return initialState
  },
})
