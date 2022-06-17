import { createSlice } from 'redux-starter-kit'
import { takeEvery, call, put, all, select } from 'redux-saga/effects'
import { assignmentApi } from '@edulastic/api'
import { captureSentryException, notification } from '@edulastic/common'
import { omitBy, isUndefined, isEmpty, invert, set, get, maxBy } from 'lodash'
import {
  assignmentPolicyOptions,
  assignmentStatusOptions,
  test,
} from '@edulastic/constants'
import { receiveTestActivitySaga } from '../ClassBoard/ducks'
import { updateAdditionalDataAction } from '../src/reducers/testActivity'

const { passwordPolicy: passwordPolicyValues } = test

const slice = createSlice({
  initialState: {
    assignment: null,
    loading: false,
    updateSettings: {},
  },
  reducers: {
    loadAssignment: (state) => {
      state.loading = true
    },
    stopLoading: (state) => {
      state.loading = false
    },
    updateAssignmentClassSettings: (state) => {
      state.loading = true
    },
    updateAssignmentClassSettingsSucess: (state) => {
      state.loading = false
      state.originalAssignment = state.assignment
      state.updateSettings = {}
    },
    loadAssignmentSucess: (state, { payload }) => {
      state.loading = false
      state.assignment = payload
      state.originalAssignment = payload
      state.updateSettings = {}
    },
    updateAssignmentClassSettingsError: (state) => {
      state.assignment = state.originalAssignment
      state.loading = false
      state.updateSettings = {}
    },
    updateAssignment: (state, { payload }) => {
      Object.assign(state.assignment, payload)
    },
    changeAttribute: (state, { payload }) => {
      let { key, value } = payload
      const { isAdmin, status } = payload
      if (
        ['startDate', 'endDate', 'dueDate', 'allowedOpenDate'].includes(key)
      ) {
        state.assignment = state.assignment || {}
        state.assignment.class = state.assignment.class || []
        if (value) {
          state.assignment.class[0][key] = value.valueOf()
          state.updateSettings[key] = value.valueOf()
        }
      } else {
        state.assignment[key] = value
        state.updateSettings[key] = value
        if (
          key === 'passwordPolicy' &&
          value === passwordPolicyValues.REQUIRED_PASSWORD_POLICY_DYNAMIC &&
          status === assignmentStatusOptions.NOT_OPEN
        ) {
          key = 'openPolicy'
          value = isAdmin
            ? assignmentPolicyOptions.POLICY_OPEN_MANUALLY_BY_TEACHER
            : assignmentPolicyOptions.POLICY_OPEN_MANUALLY_IN_CLASS

          state.assignment[key] = value
          state.updateSettings[key] = value
        }
        if (
          key === 'openPolicy' &&
          value === assignmentPolicyOptions.POLICY_AUTO_ON_STARTDATE
        ) {
          set(state.assignment, 'class[0].startDate', Date.now())
          state.updateSettings.startDate = Date.now()
        } else if (
          key === 'openPolicy' &&
          value !== assignmentPolicyOptions.POLICY_AUTO_ON_STARTDATE
        ) {
          set(state.assignment, 'class[0].allowedOpenDate', Date.now())
          state.updateSettings.allowedOpenDate = Date.now()
        } else if (
          key === 'closePolicy' &&
          value === assignmentPolicyOptions.POLICY_AUTO_ON_DUEDATE
        ) {
          const newDueDate = new Date(
            get(state.assignment, 'class[0].startDate', Date.now()) +
              1000 * 60 * 60 * 24 * 7
          )
          set(
            state.assignment,
            'class[0].endDate',
            newDueDate.setHours(23, 59, 59)
          )
          state.updateSettings.endDate = newDueDate.setHours(23, 59, 59)
        } else if (key === 'autoRedirect') {
          if (value === true) {
            const autoRedirectSettings = {
              maxRedirects: 1,
              showPreviousAttempt: 'STUDENT_RESPONSE_AND_FEEDBACK',
              questionsDelivery: 'ALL',
            }
            state.assignment.autoRedirectSettings = autoRedirectSettings
            state.updateSettings.autoRedirectSettings = autoRedirectSettings
          } else {
            delete state.assignment.autoRedirectSettings
            delete state.updateSettings.autoRedirectSettings
          }
        } else if (key === 'restrictNavigationOut') {
          if (value === 'warn-and-report-after-n-alerts') {
            state.assignment.restrictNavigationOutAttemptsThreshold = 5
            state.updateSettings.restrictNavigationOutAttemptsThreshold = 5
          } else {
            if (!value) {
              state.assignment.restrictNavigationOut = null
              state.updateSettings.restrictNavigationOut = null
            }
            delete state.assignment.restrictNavigationOutAttemptsThreshold
            delete state.updateSettings.restrictNavigationOutAttemptsThreshold
          }
        }
        if (
          key === 'showHintsToStudents' &&
          value === false &&
          state.assignment.penaltyOnUsingHints > 0
        ) {
          state.assignment.penaltyOnUsingHints = 0
          state.updateSettings.penaltyOnUsingHints = 0
        }
      }
    },
  },
})

export { slice }

const assignmentStatusArray = [
  assignmentStatusOptions.NOT_OPEN,
  assignmentStatusOptions.IN_PROGRESS,
  assignmentStatusOptions.IN_GRADING,
  assignmentStatusOptions.DONE,
  assignmentStatusOptions.ARCHIVED,
]
const assignmentStatusOptionsKeys = invert(assignmentStatusArray)
function* loadAssignmentSaga({ payload }) {
  try {
    const { assignmentId, classId } = payload
    const data = yield call(assignmentApi.getById, assignmentId)
    /**
     * filtering out other classes
     */
    data.class = (data.class || []).filter((x) => x._id === classId)
    /**
     * logic for picking correct status for a class considering redirect
     */
    const statusKeys = data.class.map((x) =>
      parseInt(assignmentStatusOptionsKeys[x.status], 10)
    )
    const statusKey = Math.min(statusKeys)
    if (data.class[0]) {
      const { releaseScore } = data.class[0]
      if (releaseScore) {
        data.releaseScore = releaseScore
      }
      data.class[0].status = assignmentStatusArray[statusKey]
      data.class[0].endDate = (maxBy(data.class, 'endDate') || {}).endDate
      if (!data.class[0].startDate) {
        data.class[0].startDate = data?.class?.[0]?.openDate || Date.now()
      }
      if (!data.class[0].endDate) {
        const newEndDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
        data.class[0].endDate = newEndDate.setHours(23, 59, 59)
      }
    }
    /**
     * if class level openPolicy and  closePolicy present,
     * override the top level with class level
     */
    const {
      openPolicy,
      closePolicy,
      allowedTime,
      pauseAllowed,
      answerOnPaper,
      maxAttempts,
      maxAnswerChecks,
      calcType,
      passwordPolicy,
      passwordExpireIn,
      assignmentPassword,
      penaltyOnUsingHints,
    } = data.class[0] || {}
    if (openPolicy) {
      data.openPolicy = openPolicy
    }
    if (closePolicy) {
      data.closePolicy = closePolicy
    }
    if (allowedTime) {
      data.allowedTime = allowedTime
    }
    if (typeof pauseAllowed !== 'undefined') {
      data.pauseAllowed = pauseAllowed
    }
    if (answerOnPaper !== undefined) {
      data.answerOnPaper = answerOnPaper
    }
    if (maxAttempts) {
      data.maxAttempts = maxAttempts
    }
    if (maxAnswerChecks !== undefined) {
      data.maxAnswerChecks = maxAnswerChecks
    }
    if (calcType) {
      data.calcType = calcType
    }
    if (typeof penaltyOnUsingHints === 'number') {
      data.penaltyOnUsingHints = penaltyOnUsingHints
    }
    if (passwordPolicy !== undefined) {
      data.passwordPolicy = passwordPolicy
      if (passwordExpireIn !== undefined) {
        data.passwordExpireIn = passwordExpireIn
      }
      if (assignmentPassword !== undefined) {
        data.assignmentPassword = assignmentPassword
      }
    }
    yield call(receiveTestActivitySaga, { payload })
    yield put(slice.actions.loadAssignmentSucess(data))
  } catch (err) {
    const {
      data: { message: errorMessage },
    } = err.response
    captureSentryException(err)
    yield put(slice.actions.stopLoading())
    notification({ msg: errorMessage || 'Loading assignment failed' })
  }
}

function getSettingsSelector(state) {
  const assignment = state.LCBAssignmentSettings?.updateSettings || {}
  const existingSettings = state.LCBAssignmentSettings?.assignment || {}
  const {
    openPolicy,
    closePolicy,
    releaseScore,
    startDate,
    endDate,
    calcType,
    dueDate,
    allowedTime,
    pauseAllowed,
    answerOnPaper,
    maxAttempts,
    maxAnswerChecks,
    passwordPolicy,
    passwordExpireIn,
    assignmentPassword,
    autoRedirect,
    autoRedirectSettings,
    blockNavigationToAnsweredQuestions,
    multiLanguageEnabled,
    blockSaveAndContinue,
    restrictNavigationOut,
    restrictNavigationOutAttemptsThreshold,
    allowedOpenDate,
    allowTeacherRedirect,
    showHintsToStudents,
    penaltyOnUsingHints,
  } = assignment

  const passWordPolicySettings = { passwordPolicy }

  if (
    passwordPolicy === test.passwordPolicy.REQUIRED_PASSWORD_POLICY_DYNAMIC ||
    passwordExpireIn
  ) {
    passWordPolicySettings.passwordExpireIn =
      existingSettings.passwordExpireIn === undefined
        ? 900
        : existingSettings.passwordExpireIn
    passWordPolicySettings.passwordPolicy = existingSettings.passwordPolicy
    if (!passWordPolicySettings.passwordExpireIn) {
      notification({ msg: 'Please set password expiry time' })
      return false
    }
  }
  if (
    passwordPolicy === test.passwordPolicy.REQUIRED_PASSWORD_POLICY_STATIC ||
    assignmentPassword
  ) {
    passWordPolicySettings.assignmentPassword =
      existingSettings.assignmentPassword
    passWordPolicySettings.passwordPolicy = existingSettings.passwordPolicy
    if (!existingSettings.assignmentPassword) {
      notification({ msg: 'Please set the assignment password' })
      return false
    }
  }
  if (
    existingSettings.passwordPolicy ===
      test.passwordPolicy.REQUIRED_PASSWORD_POLICY_STATIC &&
    !existingSettings.assignmentPassword
  ) {
    notification({ msg: 'Please set the assignment password' })
    return false
  }

  if (autoRedirect === true) {
    if (!autoRedirectSettings.showPreviousAttempt) {
      notification({
        type: 'warn',
        msg: 'Please set the value for Show Previous Attempt',
      })
      return false
    }
    if (!autoRedirectSettings.questionsDelivery) {
      notification({
        type: 'warn',
        msg: 'Please set the value for Question Delivery',
      })
      return false
    }
    if (!autoRedirectSettings.scoreThreshold) {
      notification({
        type: 'warn',
        msg: 'Please set Score Threshold value',
      })
      return false
    }
    if (!autoRedirectSettings.maxRedirects) {
      notification({
        type: 'warn',
        msg: 'Please set value of Max Attempts Allowed for auto redirect',
      })
      return false
    }
  }

  return omitBy(
    {
      openPolicy,
      closePolicy,
      releaseScore,
      startDate,
      endDate,
      calcType,
      dueDate,
      allowedTime,
      pauseAllowed,
      answerOnPaper,
      maxAttempts,
      maxAnswerChecks,
      ...passWordPolicySettings,
      autoRedirect,
      autoRedirectSettings,
      blockNavigationToAnsweredQuestions,
      multiLanguageEnabled,
      blockSaveAndContinue,
      restrictNavigationOut,
      restrictNavigationOutAttemptsThreshold,
      allowedOpenDate,
      allowTeacherRedirect,
      showHintsToStudents,
      penaltyOnUsingHints,
    },
    isUndefined
  )
}

function* updateAssignmentClassSettingsSaga({ payload }) {
  const { assignmentId, classId } = payload
  try {
    const settings = yield select(getSettingsSelector)
    if (settings === false) {
      yield put(slice.actions.updateAssignmentClassSettingsSucess())
      return
    }
    if (isEmpty(settings)) {
      yield put(slice.actions.updateAssignmentClassSettingsSucess())
      notification({ messageKey: 'noChangesToBeSaved' })
      return
    }
    yield call(assignmentApi.updateClassSettings, {
      assignmentId,
      classId,
      settings,
    })
    yield put(slice.actions.updateAssignmentClassSettingsSucess())
    if (typeof settings.answerOnPaper === 'boolean') {
      yield put(
        updateAdditionalDataAction({ answerOnPaper: settings.answerOnPaper })
      )
    }
    notification({
      type: 'success',
      messageKey: 'settingsUpdatedSuccessfully',
    })
  } catch (err) {
    const {
      data: { message: errorMessage },
    } = err.response
    captureSentryException(err)
    yield put(slice.actions.updateAssignmentClassSettingsError())
    notification({
      msg: errorMessage || 'Updating assignment settings failed',
    })
  }
}

export function* watcherSaga() {
  yield all([
    yield takeEvery(slice.actions.loadAssignment, loadAssignmentSaga),
    yield takeEvery(
      slice.actions.updateAssignmentClassSettings,
      updateAssignmentClassSettingsSaga
    ),
  ])
}
