import {
  createAction,
  createSelector as createSelectorator,
} from 'redux-starter-kit'
import { takeEvery, put, call, all, select } from 'redux-saga/effects'
import { values, groupBy, last, maxBy } from 'lodash'
import { createSelector } from 'reselect'
import { normalize } from 'normalizr'
import { assignmentApi, reportsApi } from '@edulastic/api'

// external actions
import {
  testActivity as testActivityConstants,
  testActivityStatus,
} from '@edulastic/constants'
import {
  assignmentSchema,
  setAssignmentsAction,
  setAssignmentsLoadingAction,
} from '../sharedDucks/AssignmentModule/ducks'
import {
  setReportsAction,
  reportSchema,
} from '../sharedDucks/ReportsModule/ducks'
import { getServerTs } from '../utils'

// constants
export const getCurrentGroup = createSelectorator(
  ['user.user.orgData.defaultClass'],
  (r) => r
)

export const getClassIds = createSelectorator(
  ['user.user.orgData.classList'],
  (cls) => (cls || []).map((cl) => cl._id)
)
export const currentUserId = createSelectorator(['user.user._id'], (r) => r)

export const FILTERS = {
  ALL: 'all',
  SUBMITTED: 'submitted',
  GRADED: 'graded',
  MISSED: 'missed',
}

// types
export const FETCH_ASSIGNMENTS_DATA = '[studentAssignments] fetch assignments'

// actions
export const fetchAssignmentsAction = createAction(FETCH_ASSIGNMENTS_DATA)

// sagas
// fetch and load assignments and reports for the student
function* fetchAssignments({ payload }) {
  try {
    const groupId = yield select(getCurrentGroup)
    yield put(setAssignmentsLoadingAction())
    const [assignments, reports] = yield all([
      call(assignmentApi.fetchAssigned, payload),
      call(reportsApi.fetchReports, groupId),
    ])

    // normalize assignments
    const {
      result: allAssignments,
      entities: { assignments: assignmentObj },
    } = normalize(assignments, [assignmentSchema])

    yield put(setAssignmentsAction({ allAssignments, assignmentObj }))

    // normalize reportsx``
    const {
      result: allReports,
      entities: { reports: reportsObj },
    } = normalize(reports, [reportSchema])

    yield put(setReportsAction({ allReports, reportsObj }))
  } catch (e) {
    console.log(e)
  }
}

// set actions watcherss
export function* watcherSaga() {
  yield all([yield takeEvery(FETCH_ASSIGNMENTS_DATA, fetchAssignments)])
}

// selectors

const assignmentsSelector = (state) => state.studentAssignment.byId
const reportsById = (state) => state.studentReport.byId
const reportsSelector = createSelector(reportsById, (reports) => {
  const filteredReports = {}
  if (!Object.keys(reports).length) {
    return filteredReports
  }
  for (const r in reports) {
    if (reports[r]?.status === testActivityStatus.NOT_STARTED) {
      continue
    }
    filteredReports[r] = reports[r]
  }
  return filteredReports
})
export const filterSelector = (state) => state.studentReport.filter

const isReport = (assignment, classIds, userId) => {
  // either user has ran out of attempts
  // or assignments is past dueDate
  const lastAttempt = last(assignment.reports) || {}
  assignment.reports = assignment.reports.filter((r) => r.status !== 0)
  const maxAttempts = (assignment && assignment.maxAttempts) || 1
  const attempts = (assignment.reports && assignment.reports.length) || 0
  let { endDate } = assignment
  const serverTimeStamp = getServerTs(assignment)
  const { class: groups = [], classId: currentGroup } = assignment
  if (!endDate) {
    const currentUserGroups = groups.filter(
      (clazz) =>
        (classIds.includes(clazz._id) && !clazz.students.length) ||
        (clazz.students.length && clazz.students.includes(userId))
    )
    endDate = (
      maxBy(
        currentUserGroups.filter((cl) =>
          currentGroup ? cl._id === currentGroup : true
        ) || [],
        'endDate'
      ) || {}
    ).endDate
    if (!endDate) {
      // IF POLICIES ARE MANUAL CLOSE UNTIL AUTHOR REDIRECT END DATE WILL BE undefined
      const currentClass =
        currentUserGroups.find((cl) =>
          currentGroup
            ? cl._id === currentGroup
            : classIds.find((x) => x === cl._id)
        ) || {}
      if (currentClass.closed !== undefined) return currentClass.closed
    }
  }
  // End date is passed but dont show in report if UTA status is in progress  
  return (
    attempts >= maxAttempts || (serverTimeStamp > endDate &&
      lastAttempt.status !== testActivityStatus.START)
  )
}

const statusFilter = (filterType) => (assignment) => {
  const lastAttempt = last(assignment.reports) || {}
  const isSubmitted =
    (assignment.reports.length === 1 && lastAttempt.status === 1) ||
    assignment.reports.length > 1
  const isAbsent = lastAttempt.status === 2 || !assignment.reports.length
  const isGraded =
    lastAttempt.graded ==
    testActivityConstants.studentAssignmentConstants.assignmentStatus.GRADED
  switch (filterType) {
    case FILTERS.MISSED:
      return isAbsent
    case FILTERS.SUBMITTED:
      return isSubmitted && !isGraded && !isAbsent
    case FILTERS.GRADED:
      return isGraded
    default:
      return true
  }
}

export const getAllAssignmentsSelector = createSelector(
  assignmentsSelector,
  reportsSelector,

  getCurrentGroup,
  getClassIds,
  currentUserId,
  (assignmentsObj, reportsObj, currentGroup, classIds, userId) => {
    const classIdentifiers = values(assignmentsObj).flatMap((item) =>
      item.class.map((item) => item.identifier)
    )
    const reports = values(reportsObj).filter((item) =>
      classIdentifiers.includes(item.assignmentClassIdentifier)
    )
    // group reports by assignmentsID
    const groupedReports = groupBy(
      reports,
      (item) => `${item.assignmentId}_${item.groupId}`
    )
    const assignments = values(assignmentsObj)
      .flatMap((assignment) => {
        // no redirected classes and no class filter or class ID match the filter and student belongs to the class
        const allClassess = assignment.class.filter(
          (clazz) =>
            clazz.redirect !== true &&
            (!currentGroup || currentGroup === clazz._id) &&
            classIds.includes(clazz._id) &&
            (clazz.students?.length > 0
              ? clazz.students?.includes(userId)
              : true)
        )
        return allClassess.map((clazz) => ({
          ...assignment,
          maxAttempts: clazz.maxAttempts || assignment.maxAttempts,
          classId: clazz._id,
          reports: groupedReports[`${assignment._id}_${clazz._id}`] || [],
          ...(clazz.allowedTime ? { allowedTime: clazz.allowedTime } : {}),
        }))
      })
      .filter((assignment) => isReport(assignment, classIds, userId))

    return assignments.sort((a, b) => {
      const a_report = a.reports.find((report) => !report.archived)
      const b_report = b.reports.find((report) => !report.archived)
      return b_report?.endDate - a_report?.endDate
    })
  }
)

export const getAssignmentsSelector = createSelector(
  getAllAssignmentsSelector,
  filterSelector,
  (assignments, filter) => assignments.filter(statusFilter(filter))
)

export const assignmentsCountByFilerNameSelector = createSelector(
  getAllAssignmentsSelector,
  (assignments) => {
    let MISSED = 0
    let SUBMITTED = 0
    let GRADED = 0
    assignments.forEach((assignment) => {
      const lastAttempt = last(assignment.reports) || {}
      const isSubmitted =
        (assignment.reports.length === 1 && lastAttempt.status === 1) ||
        assignment.reports.length > 1
      const isAbsent = lastAttempt.status === 2 || !assignment.reports.length
      const isGraded =
        lastAttempt.graded ==
        testActivityConstants.studentAssignmentConstants.assignmentStatus.GRADED
      if (isAbsent) {
        MISSED++
      } else if (isSubmitted && !isGraded) {
        SUBMITTED++
      } else if (isGraded) {
        GRADED++
      }
    })
    return {
      ALL: assignments.length,
      MISSED,
      SUBMITTED,
      GRADED,
    }
  }
)
