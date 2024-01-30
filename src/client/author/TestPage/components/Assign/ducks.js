import * as moment from 'moment'
import { omit, get, isEmpty } from 'lodash'
import { notification } from '@edulastic/common'
import { createReducer, createAction } from 'redux-starter-kit'
import { createSelector } from 'reselect'
import {
  test as testConstants,
  roleuser,
  testTypes as testTypesConstants,
} from '@edulastic/constants'
import { assignmentApi, getVQUsageCountApi, testsApi } from '@edulastic/api'
import * as Sentry from '@sentry/browser'
import {
  all,
  call,
  put,
  takeEvery,
  select,
  takeLatest,
} from 'redux-saga/effects'
import { replace, push } from 'connected-react-router'
import { testCategoryTypes } from '@edulastic/constants/const/test'
import { getTestSelector, getTestIdSelector } from '../../ducks'

import { formatAssignment } from './utils'
import { getUserNameSelector, getUserId } from '../../../src/selectors/user'
import { UPDATE_CURRENT_EDITING_ASSIGNMENT } from '../../../src/constants/actions'
import { getPlaylistEntitySelector } from '../../../PlaylistPage/ducks'
import {
  getUserFeatures,
  getUserRole,
  setUserFeaturesAction,
} from '../../../../student/Login/ducks'
import { toggleDeleteAssignmentModalAction } from '../../../sharedDucks/assignments'
import { updateAssingnmentSettingsAction } from '../../../AssignTest/duck'
import {
  getAdvancedSearchFilterSelector,
  getIsAdvancedSearchSelectedSelector,
  getIsAllClassSelectedSelector,
} from '../../../AdvanceSearch/ducks'

const { completionTypes, passwordPolicy } = testConstants
const assignBehaviour = {
  async: 'ASYNCHRONOUS_ASSIGN',
  sync: 'SYNCHRONOUS_ASSIGN',
}

// constants
export const SAVE_ASSIGNMENT = '[assignments] save assignment'
export const UPDATE_ASSIGNMENT = '[assignments] update assignment'
export const UPDATE_SET_ASSIGNMENT = '[assignments] update set assingment'
export const FETCH_ASSIGNMENTS = '[assignments] fetch assignments'
export const LOAD_ASSIGNMENTS = '[assignments] load assignments'
export const DELETE_ASSIGNMENT = '[assignments] delete assignment'
export const REMOVE_ASSIGNMENT = '[assignments] remove assignment'
export const SET_CURRENT_ASSIGNMENT =
  '[assignments] set current editing assignment'
export const SET_ASSIGNMENT_SAVING = '[assignments] set assignment saving state'
export const SET_BULK_ASSIGNMENT_SAVING =
  '[assignments] set bulk assignment saving state'
export const TOGGLE_CONFIRM_COMMON_ASSIGNMENTS =
  '[assignments] toggle confirmation common assignments'
export const UPDATE_ASSIGN_FAIL_DATA = '[assignments] update error data'
export const TOGGLE_DUPLICATE_ASSIGNMENT_POPUP =
  '[assignments] toggle duplicate assignmnts popup'
export const SET_ASSIGNMENT = '[assignments] set assignment'
export const SET_TEST_DATA = '[tests] set test data'
export const ADD_SEARCH_TERMS_FILTER =
  '[assignment settings] add search terms filter'

// actions
export const setAssignmentAction = createAction(SET_ASSIGNMENT)
export const fetchAssignmentsAction = createAction(FETCH_ASSIGNMENTS)
export const setCurrentAssignmentAction = createAction(SET_CURRENT_ASSIGNMENT)
export const saveAssignmentAction = createAction(SAVE_ASSIGNMENT)
export const deleteAssignmentAction = createAction(DELETE_ASSIGNMENT)
export const loadAssignmentsAction = createAction(LOAD_ASSIGNMENTS)
export const removeAssignmentsAction = createAction(REMOVE_ASSIGNMENT)
export const setAssignmentSavingAction = createAction(SET_ASSIGNMENT_SAVING)
export const setBulkAssignmentSavingAction = createAction(
  SET_BULK_ASSIGNMENT_SAVING
)
export const toggleHasCommonAssignmentsPopupAction = createAction(
  TOGGLE_CONFIRM_COMMON_ASSIGNMENTS
)
export const updateAssignFailDataAction = createAction(UPDATE_ASSIGN_FAIL_DATA)
export const toggleHasDuplicateAssignmentPopupAction = createAction(
  TOGGLE_DUPLICATE_ASSIGNMENT_POPUP
)
export const setSearchTermsFilterAction = (payload) => ({
  type: ADD_SEARCH_TERMS_FILTER,
  payload,
})

const initialState = {
  isLoading: false,
  isAssigning: false,
  hasCommonStudents: false,
  hasDuplicateAssignments: false,
  assignments: [],
  conflictData: {},
  current: '', // id of the current one being edited
  searchTerms: {},
}

const setAssignment = (state, { payload }) => {
  state.isLoading = false
  state.assignments = payload
}

const addAssignment = (state, { payload }) => {
  let isExisting = false
  state.isAssigning = false
  state.assignments = state.assignments.map((item) => {
    if (item._id === payload._id) {
      isExisting = true
      return payload
    }
    return item
  })

  if (!isExisting) {
    state.assignments.push(payload)
  }
}

const setCurrent = (state, { payload }) => {
  state.current = payload
}

const removeAssignment = (state, { payload }) => {
  state.assignments = state.assignments.filter((item) => item._id !== payload)
}

const setAssignmentIsSaving = (state, { payload }) => {
  state.isAssigning = payload
}

const setBulkAssignmentIsSaving = (state, { payload }) => {
  state.isBulkAssigning = payload
}

const setAssignmentFailStatus = (state, { payload }) => {
  state.hasCommonStudents = true
  state.conflictData = payload
}

const toggleCommonAssignmentsPopup = (state, { payload }) => {
  state.hasCommonStudents = payload
}

const toggleHasDuplicateAssignmentsPopup = (state, { payload }) => {
  state.hasDuplicateAssignments = payload
}

const updateSearchTermsFilter = (state, { payload }) => {
  state.searchTerms = payload
}

export const reducer = createReducer(initialState, {
  [FETCH_ASSIGNMENTS]: (state) => {
    state.isLoading = true
  },
  [LOAD_ASSIGNMENTS]: setAssignment,
  [SET_ASSIGNMENT]: addAssignment,
  [SET_CURRENT_ASSIGNMENT]: setCurrent,
  [REMOVE_ASSIGNMENT]: removeAssignment,
  [SET_ASSIGNMENT_SAVING]: setAssignmentIsSaving,
  [SET_BULK_ASSIGNMENT_SAVING]: setBulkAssignmentIsSaving,
  [UPDATE_ASSIGN_FAIL_DATA]: setAssignmentFailStatus,
  [TOGGLE_CONFIRM_COMMON_ASSIGNMENTS]: toggleCommonAssignmentsPopup,
  [TOGGLE_DUPLICATE_ASSIGNMENT_POPUP]: toggleHasDuplicateAssignmentsPopup,
  [ADD_SEARCH_TERMS_FILTER]: updateSearchTermsFilter,
})

// selectors
const _module = 'authorTestAssignments'

export const stateSelector = (state) => state[_module]

export const getIsloadingAssignmentSelector = createSelector(
  stateSelector,
  (state) => state.isLoading
)

export const getSearchTermsFilterSelector = createSelector(
  stateSelector,
  (state) => state.searchTerms
)

const currentSelector = createSelector(stateSelector, (state) => state.current)

export const getAssignmentsSelector = createSelector(
  stateSelector,
  (state) => state.assignments
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
      openPolicy: 'Automatically on Start Date',
      closePolicy: 'Automatically on Due Date',
      class: [],
    }
  }
)

export const getHasCommonStudensSelector = createSelector(
  stateSelector,
  (state) => state.hasCommonStudents
)

export const getCommonStudentsSelector = createSelector(
  stateSelector,
  (state) => state.conflictData?.commonStudents || []
)

export const getHasDuplicateAssignmentsSelector = createSelector(
  stateSelector,
  (state) => state.hasDuplicateAssignments
)

// saga
function* deriveAssignmentPayload({
  assignments,
  duplicatesAndCommonStudentsSettings,
  classesSelected,
}) {
  const assignmentPayload = {
    assignments,
    duplicatesAndCommonStudentsSettings,
  }
  const userRole = yield select(getUserRole)
  const isAllClassSelected = yield select(getIsAllClassSelectedSelector)
  if (userRole === roleuser.TEACHER) {
    const groups = classesSelected.map((clazz) => clazz._id)
    const students = classesSelected.some((clazz) => clazz.students)
      ? classesSelected.map((clazz) => {
          return { groupId: clazz._id, studentsToAssign: clazz.students }
        })
      : []
    assignmentPayload.filters = {
      groups,
      ...(!isEmpty(students) ? { students } : {}),
    }
  } else if (!isAllClassSelected) {
    assignmentPayload.filters = {
      groups: classesSelected.map((clazz) => clazz._id),
    }
  } else {
    const isAdvancedSearchSelected = yield select(
      getIsAdvancedSearchSelectedSelector
    )
    if (isAdvancedSearchSelected) {
      assignmentPayload.query = yield select(getAdvancedSearchFilterSelector)
    } else {
      const searchTermsFilter = yield select(getSearchTermsFilterSelector)
      const filters = {
        schools: searchTermsFilter.institutionIds,
        grades: searchTermsFilter.grades,
        subjects: searchTermsFilter.subjects,
        groupType:
          searchTermsFilter.classType === 'all'
            ? undefined
            : searchTermsFilter.classType,
        courses: searchTermsFilter.courseIds,
        tags: searchTermsFilter.tags,
      }
      assignmentPayload.filters = filters
    }
  }
  return assignmentPayload
}

function* saveAssignment({ payload }) {
  try {
    // Backend doesn't require PARTIAL_CREDIT_IGNORE_INCORRECT
    // Penalty true/false is set to determine the case
    if (
      payload.scoringType ===
      testConstants.evalTypeLabels.PARTIAL_CREDIT_IGNORE_INCORRECT
    ) {
      payload.scoringType = testConstants.evalTypeLabels.PARTIAL_CREDIT
    }

    let testIds
    yield put(setAssignmentSavingAction(true))
    if (!payload.playlistModuleId && !payload.playlistId) {
      testIds = [yield select(getTestIdSelector)].map((testId) => ({ testId }))
    } else {
      const playlist = yield select(getPlaylistEntitySelector)
      testIds = []
      if (payload.testId) {
        testIds = [
          { testId: payload.testId, testVersionId: payload.testVersionId },
        ]
      } else {
        const module = playlist.modules.filter(
          (m) => m._id === payload.playlistModuleId
        )
        if (!module || !(module && module.length)) {
          yield put(setAssignmentSavingAction(false))
          notification({ messageKey: 'moduleNotFoundInPlaylist' })
          return
        }
        module &&
          module[0].data.forEach((dat) => {
            if (dat.contentType === 'test') {
              testIds.push({
                testId: dat.contentId,
                testVersionId: dat.contentVersionId,
              })
            }
          })
        if (!testIds.length) {
          yield put(setAssignmentSavingAction(false))
          notification({ messageKey: 'noTestInModule' })
          return
        }
      }
    }
    const test = yield select(getTestSelector)
    if (!testIds || !(testIds && testIds.length)) {
      const entity = yield call(testsApi.create, test)
      testIds = [entity._id]
      yield put({
        type: SET_TEST_DATA,
        payload: {
          data: entity,
        },
      })
      yield put(replace(`/author/tests/${entity._id}`))
    }
    const name = yield select(getUserNameSelector)
    const _id = yield select(getUserId)
    const assignedBy = { _id, name }
    // if no class is selected dont bother sending a request.
    if (!payload.class.length) {
      yield put(setAssignmentSavingAction(false))
      return
    }
    const startDate = payload.startDate && moment(payload.startDate).valueOf()
    const endDate = payload.endDate && moment(payload.endDate).valueOf()
    const dueDate = payload.dueDate && moment(payload.dueDate).valueOf()

    const userRole = yield select(getUserRole)
    const isTestLet = testTypesConstants.TEST_TYPES.TESTLET.includes(
      test.testType
    )
    const testType = isTestLet
      ? test.testType
      : get(payload, 'testType', test.testType)
    // teacher can not update test content visibility.
    const visibility = payload.testContentVisibility &&
      userRole !== roleuser.TEACHER && {
        testContentVisibility: payload.testContentVisibility,
      }
    const userId = yield select(getUserId)
    const isAuthor = test.authors?.some((author) => author._id === userId)
    if (test.freezeSettings && !isAuthor) {
      delete payload.performanceBand
      delete payload.standardGradingScale
    }
    const features = yield select(getUserFeatures)
    const {
      allowCommonStudents,
      allowDuplicates,
      removeDuplicates,
      class: classesSelected,
      ...assignmentSettings
    } = payload

    const containsCanvasClass = classesSelected.some(
      (clazz) => clazz.canvasData
    )

    if (features.free && !features.premium) {
      assignmentSettings.maxAttempts = 1
      assignmentSettings.markAsDone = completionTypes.AUTOMATICALLY
      assignmentSettings.safeBrowser = false
      assignmentSettings.shuffleAnswers = false
      assignmentSettings.shuffleQuestions = false
      assignmentSettings.answerOnPaper = false
      assignmentSettings.maxAnswerChecks = 0
      assignmentSettings.passwordPolicy =
        passwordPolicy.REQUIRED_PASSWORD_POLICY_OFF
      assignmentSettings.timedAssignment = false
      assignmentSettings.showRubricToStudents = false
      assignmentSettings.allowAutoEssayEvaluation = false
    }

    const referenceDocAttributes =
      assignmentSettings.referenceDocAttributes ||
      test.referenceDocAttributes ||
      {}
    assignmentSettings.referenceDocAttributes = referenceDocAttributes
    // Missing termId notify
    if (!assignmentSettings.termId) {
      Sentry.captureException(
        new Error('[Assignments] missing termId in assigned assignment.')
      )
      Sentry.withScope((scope) => {
        scope.setExtra('assignmentPayload', { ...assignmentSettings, userId })
      })
    }

    const assignments = testIds.map(({ testId, testVersionId }) => {
      return omit(
        {
          ...assignmentSettings,
          startDate,
          endDate,
          dueDate,
          testType,
          ...visibility,
          testId,
          testVersionId,
          assignedBy,
        },
        [
          '_id',
          '__v',
          'createdAt',
          'updatedAt',
          'students',
          'scoreReleasedClasses',
          'googleAssignmentIds',
          'allowCommonStudents',
          'removeDuplicates',
          'allowDuplicates',
        ]
      )
    })

    const duplicatesAndCommonStudentsSettings = {
      allowCommonStudents: !!allowCommonStudents,
      removeDuplicates: !!removeDuplicates,
      allowDuplicates: !!allowDuplicates,
    }

    const assignmentPayload = yield call(deriveAssignmentPayload, {
      assignments,
      duplicatesAndCommonStudentsSettings,
      classesSelected,
    })
    const result = yield call(
      assignmentApi.createAssignmentV2,
      assignmentPayload
    )

    if (test.testCategory === testCategoryTypes.VIDEO_BASED) {
      const { vqUsageCount } = yield call(getVQUsageCountApi.getVQUsageCount)
      yield put(
        setUserFeaturesAction({
          featureName: 'vqUsageCount',
          value: vqUsageCount,
        })
      )
    }
    const gSyncStatus = []
    result.assignments?.forEach((_data) => {
      if (_data.gSyncStatus) gSyncStatus.push(_data.gSyncStatus)
      delete _data.gSyncStatus
    })
    const assignment = result?.assignments[0]
      ? formatAssignment(result.assignments[0])
      : {}
    yield put({ type: SET_ASSIGNMENT, payload: assignment })
    yield put({
      type: UPDATE_CURRENT_EDITING_ASSIGNMENT,
      payload: assignment,
    })
    yield put(setAssignmentSavingAction(false))
    yield put(toggleHasCommonAssignmentsPopupAction(false))
    yield put(toggleHasDuplicateAssignmentPopupAction(false))

    const prevLocState = yield select((state) => state.router.location.state)
    // if there are no previous location , by default redirect to tests
    let locationState = { fromText: 'TEST LIBRARY', toUrl: '/author/tests' }
    if (prevLocState?.fromText && prevLocState?.toUrl) {
      locationState = prevLocState
    }

    let navigateTo = `/author/tests/${testIds[0]?.testId}`
    if (payload.playlistModuleId) {
      navigateTo = `/author/playlists/${payload.playlistId}`
    }

    if (result.message === assignBehaviour.async) {
      yield put(
        push({
          pathname: `${navigateTo}/async-assign`,
          state: {
            ...locationState,
            assignedTestId: payload.testId,
            playlistModuleId: payload.playlistModuleId,
          },
        })
      )
      return
    }

    const assignmentId = assignment._id
    const createdAt = assignment.createdAt
    const googleId = get(assignment, 'class[0].googleId', '')
    if (!assignmentId && !payload.playlistModuleId) {
      yield put(push('/author/assignments'))
    }
    if (payload.playlistModuleId && !payload.testId) {
      notification({
        type: 'success',
        messageKey: 'PlaylistAssignedSuccessfully',
      })
    }
    if (gSyncStatus.length) {
      notification({
        type: 'warn',
        messageKey: 'shareWithGoogleClassroomFailed',
      })
    }
    const isAdminRole = [
      roleuser.SCHOOL_ADMIN,
      roleuser.DISTRICT_ADMIN,
    ].includes(userRole)
    if (containsCanvasClass) {
      if (isAdminRole) {
        notification({
          type: 'success',
          messageKey: 'assignmentsWillBeSharedToCanvasINSometime',
        })
      } else
        notification({
          type: 'success',
          messageKey: 'asignmentSharedTOCanvasClassAlso',
        })
    }
    if (!assignmentId && !payload.playlistModuleId) return
    yield put(
      push({
        pathname: `${navigateTo}/assign/${assignmentId}`,
        state: {
          ...locationState,
          assignedTestId: payload.testId,
          playlistModuleId: payload.playlistModuleId,
          createdAt,
          googleId,
        },
      })
    )
  } catch (err) {
    console.error('error for save assignment', err)
    // enable button if call fails
    yield put(setAssignmentSavingAction(false))
    if (err.status === 409) {
      if (err.response.data?.commonStudents?.length) {
        return yield put(updateAssignFailDataAction(err.response.data))
      }
      return yield put(toggleHasDuplicateAssignmentPopupAction(true))
    }
    yield put(toggleHasCommonAssignmentsPopupAction(false))
    yield put(toggleHasDuplicateAssignmentPopupAction(false))
    if (
      err.status === 403 &&
      err.response.data.message === 'NO_CLASS_FOUND_AFTER_REMOVING_DUPLICATES'
    ) {
      yield put(updateAssingnmentSettingsAction({ class: [] }))
      return notification({
        msg:
          'No classes found after removing the duplicates. Select one or more to assign.',
      })
    }
    const errorMessage = err.response?.data?.message || 'Something went wrong'
    notification({ msg: errorMessage })
  }
}

// function* saveBulkAssignment({ payload }) {
//   try {
//     yield put(setBulkAssignmentSavingAction(true))

//     const { assignmentSettings, ..._payload } = payload
//     const name = yield select(getUserNameSelector)
//     const _id = yield select(getUserId)
//     const assignedBy = { _id, name }

//     const startDate =
//       assignmentSettings.startDate &&
//       moment(assignmentSettings.startDate).valueOf()
//     const endDate =
//       assignmentSettings.endDate && moment(assignmentSettings.endDate).valueOf()
//     const dueDate =
//       assignmentSettings.dueDate && moment(assignmentSettings.dueDate).valueOf()
//     const data = {
//       ...omit(assignmentSettings, ['class', 'resources', 'termId']),
//       startDate,
//       endDate,
//       dueDate,
//       assignedBy,
//     }

//     if (
//       data.scoringType ===
//       testConstants.evalTypeLabels.PARTIAL_CREDIT_IGNORE_INCORRECT
//     ) {
//       data.scoringType = testConstants.evalTypeLabels.PARTIAL_CREDIT
//     }

//     const result = yield call(assignmentApi.bulkAssign, {
//       ..._payload,
//       assignmentSettings: data,
//     })
//     notification({ type: 'info', msg: result })
//     yield put(push('/author/assignments'))
//   } catch (err) {
//     console.error('error for save assignment', err)
//     const errorMessage = err.response?.data?.message || 'Something went wrong'
//     notification({ msg: errorMessage })
//   } finally {
//     yield put(setBulkAssignmentSavingAction(false))
//   }
// }

function* loadAssignments({ payload }) {
  try {
    let testId
    let regradeAssignments = false
    if (!payload) {
      const { _id } = yield select(getTestSelector)
      testId = _id
    } else if (typeof payload === 'object') {
      testId = payload.testId
      regradeAssignments = payload.regradeAssignments
    } else {
      testId = payload
    }

    // test is not yet created!
    if (!testId) {
      return
    }
    // fetch assignments is for getting user assignments and regrade assignments is for getting org level assignments.
    const getAssignmentsApi = regradeAssignments
      ? assignmentApi.fetchRegradeAssignments
      : assignmentApi.fetchAssignments
    const data = yield call(getAssignmentsApi, testId)
    const assignments = regradeAssignments ? data : data.map(formatAssignment)
    yield put(loadAssignmentsAction(assignments))
  } catch (e) {
    console.error(e)
  }
}

function* deleteAssignment({ payload }) {
  try {
    yield assignmentApi.remove(payload)
    yield put(push('/author/assignments'))
    notification({ type: 'success', messageKey: 'AssignmentDelete' })
  } catch (error) {
    console.log(error)
    notification({ messageKey: 'failedToDelete' })
  }
  yield put(toggleDeleteAssignmentModalAction(false))
}

export function* watcherSaga() {
  yield all([
    yield takeLatest(SAVE_ASSIGNMENT, saveAssignment),
    yield takeEvery(FETCH_ASSIGNMENTS, loadAssignments),
    yield takeEvery(DELETE_ASSIGNMENT, deleteAssignment),
  ])
}

// selectors

export const getGroupSelector = (state) => state.testsAssign
