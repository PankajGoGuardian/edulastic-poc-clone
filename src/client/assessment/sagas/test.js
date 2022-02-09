import {
  testActivityApi,
  testsApi,
  assignmentApi,
  attchmentApi as attachmentApi,
} from '@edulastic/api'
import {
  takeEvery,
  call,
  all,
  put,
  select,
  take,
  takeLatest,
  fork,
} from 'redux-saga/effects'
import { Modal } from 'antd'
import {
  notification,
  Effects,
  captureSentryException,
} from '@edulastic/common'
import * as Sentry from '@sentry/browser'
import {
  getAccessToken,
  tokenExpireInHours,
} from '@edulastic/api/src/utils/Storage'
import { push } from 'react-router-redux'
import {
  keyBy as _keyBy,
  groupBy,
  get,
  flatten,
  cloneDeep,
  set,
  isEmpty,
  isUndefined,
} from 'lodash'
import produce from 'immer'
import {
  test as testContants,
  roleuser,
  testActivityStatus,
} from '@edulastic/constants'
import { ShuffleChoices } from '../utils/test'
import { Fscreen, isiOS } from '../utils/helpers'
import {
  getCurrentGroupWithAllClasses,
  toggleIosRestrictNavigationModalAction,
} from '../../student/Login/ducks'
import { markQuestionLabel } from '../Transformer'
import {
  LOAD_TEST,
  LOAD_TEST_ITEMS,
  SET_TEST_ID,
  FINISH_TEST,
  LOAD_PREVIOUS_RESPONSES,
  LOAD_ANSWERS,
  SET_TEST_ACTIVITY_ID,
  LOAD_SCRATCH_PAD,
  LOAD_SCRATCH_PAD_SAVED,
  LOAD_TEST_LEVEL_USER_WORK,
  SET_TEST_LOADING_STATUS,
  GET_ASSIGNMENT_PASSWORD,
  TEST_ACTIVITY_LOADING,
  SET_TEST_LOADING_ERROR,
  LOAD_PREVIOUS_ANSWERS,
  ADD_ITEM_EVALUATION,
  LOAD_PREVIOUS_RESPONSES_REQUEST,
  REMOVE_PREVIOUS_ANSWERS,
  CLEAR_USER_WORK,
  SET_SAVE_USER_RESPONSE,
  SWITCH_LANGUAGE,
  UPDATE_PLAYER_PREVIEW_STATE,
  RESET_TEST_ITEMS,
  SAVE_USER_WORK,
} from '../constants/actions'
import {
  saveUserResponse as saveUserResponseAction,
  setSavedBlurTimeAction,
} from '../actions/items'
import { saveUserResponse as saveUserResponseSaga } from './items'
import { loadQuestionsAction } from '../actions/questions'
import { loadBookmarkAction } from '../sharedDucks/bookmark'
import {
  setPasswordValidateStatusAction,
  setPasswordStatusAction,
  languageChangeSuccessAction,
  setShowTestInfoSuccesAction,
} from '../actions/test'
import { setShuffledOptions } from '../actions/shuffledOptions'
import {
  getCurrentUserId,
  SET_RESUME_STATUS,
  transformAssignmentForRedirect,
  fetchAssignments as fetchAssignmentsSaga,
} from '../../student/Assignments/ducks'
import {
  CLEAR_ITEM_EVALUATION,
  CHANGE_VIEW,
} from '../../author/src/constants/actions'
import {
  addAutoselectGroupItems,
  fillAutoselectGoupsWithDummyItems,
} from '../../author/TestPage/ducks'
import { PREVIEW } from '../constants/constantsForQuestions'
import { getUserRole } from '../../author/src/selectors/user'
import {
  setActiveAssignmentAction,
  utaStartTimeUpdateRequired,
} from '../../student/sharedDucks/AssignmentModule/ducks'
import { getClassIds } from '../../student/Reports/ducks'
import { startAssessmentAction } from '../actions/assessment'
import { TIME_UPDATE_TYPE } from '../themes/common/TimedTestTimer'
import { getTestLevelUserWorkSelector } from '../../student/sharedDucks/TestItem'
import {
  setSelectedThemeAction,
  setZoomLevelAction,
} from '../../student/Sidebar/ducks'

// import { checkClientTime } from "../../common/utils/helpers";

const { ITEM_GROUP_DELIVERY_TYPES, releaseGradeLabels } = testContants

const modifyTestDataForPreview = (test) =>
  produce(test, (draft) => {
    const { itemGroups } = draft
    for (const group of itemGroups) {
      if (
        group.deliveryType === ITEM_GROUP_DELIVERY_TYPES.LIMITED_RANDOM &&
        group.deliverItemsCount
      ) {
        group.items = group.items.filter((_, i) => i < group.deliverItemsCount)
      }
    }
  })

const getQuestions = (testItems = []) => {
  const allQuestions = []

  testItems.forEach((item) => {
    if (item.data) {
      const { questions = [], resources = [] } = item.data
      allQuestions.push(
        ...[...questions, ...resources].map((q) => ({
          ...q,
          testItemId: item._id,
        }))
      )
    }
  })

  return allQuestions
}

const getSettings = (test, testActivity, preview) => {
  const { assignmentSettings = {} } = testActivity || {}
  const calcType = !preview ? assignmentSettings.calcType : test.calcType
  // graphing calculator is not present for EDULASTIC so defaulting to DESMOS for now, below work around should be removed once EDULASTIC calculator is built
  const desmosGraphingCalcTypes = [
    testContants.calculatorTypes.GRAPHING,
    testContants.calculatorTypes.GRAPHING_STATE,
  ]
  const calcProvider = desmosGraphingCalcTypes.includes(calcType)
    ? 'DESMOS'
    : preview
    ? test.calculatorProvider
    : testActivity?.calculatorProvider

  const maxAnswerChecks = preview
    ? test.maxAnswerChecks
    : assignmentSettings.maxAnswerChecks
  const passwordPolicy = preview
    ? test.passwordPolicy
    : assignmentSettings.passwordPolicy
  const testType = preview ? test.testType : assignmentSettings.testType
  const playerSkinType = preview
    ? test.playerSkinType
    : assignmentSettings.playerSkinType
  const showMagnifier = preview
    ? isUndefined(test.showMagnifier)
      ? true
      : test.showMagnifier
    : assignmentSettings.showMagnifier
  const timedAssignment = preview
    ? test.timedAssignment
    : assignmentSettings.timedAssignment
  const allowedTime = preview
    ? test.allowedTime
    : assignmentSettings.allowedTime
  const pauseAllowed = preview
    ? test.pauseAllowed
    : assignmentSettings.pauseAllowed
  const enableScratchpad = preview
    ? isUndefined(test.enableScratchpad)
      ? true
      : test.enableScratchpad
    : assignmentSettings.enableScratchpad
  const releaseScore = preview
    ? test.releaseScore
    : testActivity?.testActivity?.releaseScore

  const enableSkipAlert = preview
    ? test.enableSkipAlert
    : assignmentSettings.enableSkipAlert

  const showRubricToStudents = preview
    ? test.showRubricToStudents
    : assignmentSettings.showRubricToStudents

  return {
    testType,
    calcProvider,
    playerSkinType,
    showMagnifier,
    timedAssignment,
    allowedTime,
    pauseAllowed,
    enableScratchpad,
    enableSkipAlert,
    showRubricToStudents,
    calcType: calcType || testContants.calculatorTypes.NONE,
    maxAnswerChecks: maxAnswerChecks || 0,
    passwordPolicy:
      passwordPolicy ||
      testContants.passwordPolicy.REQUIRED_PASSWORD_POLICY_OFF,
    showPreviousAttempt: assignmentSettings.showPreviousAttempt || 'NONE',
    endDate: assignmentSettings.endDate,
    closePolicy: assignmentSettings.closePolicy,
    releaseScore,
    blockNavigationToAnsweredQuestions:
      assignmentSettings?.blockNavigationToAnsweredQuestions || false,
    isTeacherPremium: assignmentSettings?.isTeacherPremium || false,
    blockSaveAndContinue: assignmentSettings?.blockSaveAndContinue || false,
    restrictNavigationOut: assignmentSettings?.restrictNavigationOut || false,
    restrictNavigationOutAttemptsThreshold:
      assignmentSettings?.restrictNavigationOutAttemptsThreshold,
  }
}

function getScratchpadDataFromAttachments(attachments) {
  const scratchPadData = {}
  attachments.forEach((attachment) => {
    if (attachment?.referrerId3) {
      const { referrerId2: itemId, referrerId3: qId } = attachment
      scratchPadData[itemId] = scratchPadData[itemId] || {
        scratchpad: {},
      }
      scratchPadData[itemId].scratchpad[qId] = attachment.data.scratchpad
    } else {
      scratchPadData[attachment.referrerId2] = attachment.data
    }
  })
  return scratchPadData
}

function* loadAnnotationsToStore({ data, referrerId2 }) {
  const result = yield attachmentApi.loadDataFromUrl(data.freeNotesStd)
  const userWork = yield select((state) => state.userWork.present[referrerId2])
  yield put({
    type: SAVE_USER_WORK,
    payload: { [referrerId2]: { ...userWork, freeNotesStd: result.data } },
  })
}

function* loadTest({ payload }) {
  const {
    testActivityId,
    preview = false,
    demo = false,
    test: testData = {},
    groupId: groupIdFromUrl,
    isShowStudentWork = false,
    playlistId,
    currentAssignmentId,
    savedUserWork,
    summary = false,
    isStudentReport = false,
    regrade = false,
  } = payload
  let { testId } = payload
  const _testId = testId
  const userRole = yield select(getUserRole)
  try {
    if (!preview && !testActivityId) {
      // we don't have a testActivityId for non-preview, lets throw error to short circuit
      Sentry.captureMessage(
        'Unable to load the test. Please contact Edulastic Support',
        'info'
      )
      return
    }
    const isFromSummary = yield select((state) =>
      get(state, 'router.location.state.fromSummary', false)
    )
    const _switchLanguage = yield select((state) =>
      get(state, 'router.location.state.switchLanguage', false)
    )
    if (
      userRole === roleuser.STUDENT &&
      !summary &&
      !isStudentReport &&
      !regrade &&
      !isFromSummary &&
      !_switchLanguage
    ) {
      const tokenExpireIn = tokenExpireInHours()
      // consider less than zero as valid so that the client side time adjust wont impact.
      const isValidSpan = tokenExpireIn > 12 || tokenExpireIn < 0
      if (!isValidSpan) {
        return window.dispatchEvent(new Event('user-token-expired'))
      }
    }

    if (userRole === roleuser.STUDENT) {
      const tokenExpireIn = tokenExpireInHours()
      // consider less than zero as valid so that the client side time adjust wont impact.
      const isValidSpan = tokenExpireIn > 12 || tokenExpireIn < 0
      if (!isValidSpan) {
        return window.dispatchEvent(new Event('user-token-expired'))
      }
    }

    // if the assessment player is loaded for showing student work
    // we shouldn't be removing evaluation and answers from store.
    if (!isShowStudentWork) {
      yield put({
        type: CLEAR_ITEM_EVALUATION,
      })

      yield put({
        type: REMOVE_PREVIOUS_ANSWERS,
      })
    }
    yield put({
      type: SET_TEST_LOADING_STATUS,
      payload: true,
    })
    yield put({
      type: TEST_ACTIVITY_LOADING,
      payload: true,
    })
    yield put(setPasswordValidateStatusAction(false))

    const studentAssesment = yield select((state) =>
      (state.router.location.pathname || '').match(
        new RegExp('/student/assessment/.*/class/.*/uta/.*/itemId/.*')
      )
    )

    // for urls that doesnt have groupId, fallback
    const groupId =
      groupIdFromUrl || (yield select(getCurrentGroupWithAllClasses))

    // if !preivew, need to load previous responses as well!
    const getTestActivity = !preview
      ? call(
          testActivityApi.getById,
          testActivityId,
          groupId,
          !!studentAssesment
        )
      : false
    const _response = yield all([getTestActivity])
    const testActivity = _response?.[0] || {}
    if (testActivity?.testActivity?.testId) {
      testId = testActivity?.testActivity?.testId
    }

    yield put({
      type: SET_TEST_ID,
      payload: {
        testId,
      },
    })
    const userAuthenticated = getAccessToken()
    const getPublicTest = userAuthenticated
      ? testsApi.getById
      : testsApi.getPublicTest
    const testRequest = !demo
      ? call(preview ? testsApi.getById : testsApi.getByIdMinimal, testId, {
          validation: true,
          data: true,
          groupId,
          testActivityId,
          ...(playlistId ? { playlistId } : {}),
          ...(currentAssignmentId ? { assignmentId: currentAssignmentId } : {}),
        }) // when preview(author side) use normal non cached api
      : call(getPublicTest, testId)

    const previousVisitedTestId = sessionStorage.getItem('currentTestId')
    if (previousVisitedTestId !== _testId) {
      yield put(setZoomLevelAction('1'))
      yield put(setSelectedThemeAction('default'))
      localStorage.setItem('selectedTheme', 'default')
      localStorage.setItem('zoomLevel', 1)
      sessionStorage.setItem('currentTestId', testId)
    }

    if (!preview) {
      /**
       * src/client/assessment/sagas/items.js:saveUserResponse
       * requires current assignment id in store (studentAssignment.current)
       */
      const { assignmentId, timeInBlur = 0 } = testActivity?.testActivity || {}
      if (assignmentId) {
        yield put(setActiveAssignmentAction(assignmentId))
      }

      yield put(setSavedBlurTimeAction(timeInBlur))

      let passwordValidated =
        testActivity?.assignmentSettings?.passwordPolicy ===
          testContants?.passwordPolicy?.REQUIRED_PASSWORD_POLICY_OFF ||
        isFromSummary ||
        _switchLanguage
      if (passwordValidated) {
        yield put(setPasswordValidateStatusAction(true))
      }

      yield put({
        type: CHANGE_VIEW,
        payload: {
          view: PREVIEW,
        },
      })

      yield put({
        type: TEST_ACTIVITY_LOADING,
        payload: false,
      })

      while (!passwordValidated) {
        try {
          const { payload: _payload } = yield take(GET_ASSIGNMENT_PASSWORD)
          const response = yield call(
            assignmentApi.validateAssignmentPassword,
            {
              assignmentId: testActivity.testActivity.assignmentId,
              password: _payload,
              groupId,
            }
          )
          if (response === 'successful') {
            passwordValidated = true
          } else if (response === 'unsuccessful') {
            yield put(
              setPasswordStatusAction('You have entered an invalid password')
            )
          } else {
            yield put(setPasswordStatusAction('validation failed'))
          }
        } catch (err) {
          if (err?.status === 403) {
            yield put(setPasswordStatusAction(err.response.data.message))
          } else {
            yield put(setPasswordStatusAction('validation failed'))
          }
          console.log(err)
          captureSentryException(err)
        }
      }
      yield put(setPasswordStatusAction(''))
    }
    const isAuthorReview = Object.keys(testData).length > 0
    let [test] = isAuthorReview
      ? [cloneDeep(testData)]
      : yield all([testRequest])
    if (test?.testItems && demo) {
      set(test, 'itemGroups[0].items', test.testItems)
    }
    if (
      preview &&
      test.itemGroups.some(
        (group = {}) =>
          group.type === testContants.ITEM_GROUP_TYPES.AUTOSELECT &&
          !group.items?.length
      )
    ) {
      test = yield addAutoselectGroupItems({ payload: test, preview })
      fillAutoselectGoupsWithDummyItems(test)
    }
    if (
      preview &&
      test.itemGroups?.some(
        (group) =>
          group.deliveryType === ITEM_GROUP_DELIVERY_TYPES.LIMITED_RANDOM
      )
    ) {
      // for all limited random group update items as per number of delivery items count
      test = modifyTestDataForPreview(test)
    }
    test.testItems = test?.itemGroups?.flatMap?.(
      (itemGroup) => itemGroup.items || []
    )
    const {
      SKIPPED,
      SKIPPED_AND_WRONG,
      SKIPPED_PARTIAL_AND_WRONG,
    } = testContants.redirectPolicy.QuestionDelivery
    if (
      [SKIPPED, SKIPPED_AND_WRONG, SKIPPED_PARTIAL_AND_WRONG].includes(
        testActivity?.assignmentSettings?.questionsDelivery
      ) &&
      testActivity.itemsToBeExcluded?.length
    ) {
      // mutating to filter the excluded items as the settings is to show SKIPPED AND WRONG / SKIPPED
      test.testItems = test.testItems.filter(
        (item) => !testActivity.itemsToBeExcluded.includes(item._id)
      )
    }
    // eslint-disable-next-line prefer-const
    let { testItems, passages } = test

    const settings = getSettings(test, testActivity, preview)

    const testType = settings.testType || test.testType

    const answerCheckByItemId = {}
    ;(testActivity.questionActivities || []).forEach((item) => {
      answerCheckByItemId[item.testItemId] = item.answerChecksUsedForItem
    })

    // if testActivity is present.
    if (!preview) {
      let allAnswers = {}
      let allPrevAnswers = {}
      let allEvaluation = {}
      let assignmentById = yield select(
        (state) => state?.studentAssignment?.byId || {}
      )
      if (isEmpty(assignmentById) || !assignmentById) {
        // load assignments
        yield call(fetchAssignmentsSaga)
      }
      const {
        testActivity: activity,
        questionActivities = [],
        previousQuestionActivities = [],
      } = testActivity
      assignmentById = yield select(
        (state) => state?.studentAssignment?.byId || {}
      )

      if (settings.restrictNavigationOut && isiOS()) {
        Fscreen.safeExitfullScreen()
        yield put(push('/home/assignments'))
        yield put(toggleIosRestrictNavigationModalAction(true))
        return
      }
      if (activity.isPaused) {
        Fscreen.safeExitfullScreen()
        yield put(push('/home/assignments'))
        setTimeout(() => {
          notification({
            type: 'warning',
            msg: 'Your assignment is paused contact your instructor',
          })
        }, 2000)
        return
      }
      // load bookmarks
      const qActivitiesGroupedByTestItem = groupBy(
        questionActivities,
        'testItemId'
      )
      const bookmarks = {}
      for (const _id of Object.keys(qActivitiesGroupedByTestItem)) {
        const isBookmarked = qActivitiesGroupedByTestItem[_id].some(
          (item) => item.bookmarked
        )
        bookmarks[_id] = isBookmarked
      }
      yield put(loadBookmarkAction(bookmarks))

      let shuffles
      if (activity.shuffleAnswers) {
        ;[testItems, shuffles] = ShuffleChoices(testItems, questionActivities)
        yield put(setShuffledOptions(shuffles))
      }
      yield put({
        type: SET_TEST_ACTIVITY_ID,
        payload: { testActivityId },
      })

      let lastAttemptedQuestion = questionActivities[0] || {}
      const previousQActivitiesById = groupBy(
        previousQuestionActivities,
        'testItemId'
      )
      const testItemIds = testItems.map((i) => i._id)
      const { attachments = [] } = yield call(
        attachmentApi.loadAllAttachments,
        {
          referrerId: testActivityId,
        }
      )
      const scratchPadData = {}
      const attachmentData = getScratchpadDataFromAttachments(attachments)
      previousQuestionActivities.forEach((item) => {
        allPrevAnswers = {
          ...allPrevAnswers,
          [`${item.testItemId}_${item.qid}`]: item.userResponse,
        }
        allEvaluation = {
          ...allEvaluation,
          [item.qid]: item.evaluation,
        }
        if (item.scratchPad) {
          scratchPadData[item.testItemId] = {
            ...item.scratchPad,
            ...attachmentData[item.testItemId],
          }
        }
      })

      yield put({
        type: ADD_ITEM_EVALUATION,
        payload: {
          ...allEvaluation,
        },
      })
      yield put({
        type: LOAD_PREVIOUS_ANSWERS,
        payload: allPrevAnswers,
      })

      yield put({
        type: LOAD_PREVIOUS_RESPONSES,
        payload: previousQActivitiesById,
      })

      questionActivities.forEach((item) => {
        allAnswers = {
          ...allAnswers,
          [`${item.testItemId}_${item.qid}`]: item.userResponse,
        }
        if (item.scratchPad) {
          scratchPadData[item.testItemId] = {
            ...item.scratchPad,
            ...attachmentData[item.testItemId],
          }
        }
        // land on the testItems which is next to testItem that is attempted and has the highest index
        // https://snapwiz.atlassian.net/browse/EV-7530 check the comments.
        if (
          testItemIds.indexOf(item.testItemId) >
            testItemIds.indexOf(lastAttemptedQuestion.testItemId) &&
          !item.skipped
        ) {
          lastAttemptedQuestion = item
        }
      })
      if (Object.keys(scratchPadData).length) {
        if (savedUserWork) {
          yield put({
            type: LOAD_SCRATCH_PAD_SAVED,
            payload: scratchPadData,
          })
        } else {
          yield put({
            type: LOAD_SCRATCH_PAD,
            payload: scratchPadData,
          })
        }
      }

      if (test.isDocBased) {
        const annotationAttachments = attachments.filter(
          ({ type }) => type === 'doc-annotations'
        )
        yield all(
          annotationAttachments.map(({ referrerId, data, referrerId2 }) =>
            fork(loadAnnotationsToStore, { referrerId, data, referrerId2 })
          )
        )
      }

      const testUserWork = get(activity, 'userWork')
      if (testUserWork) {
        yield put({
          type: LOAD_TEST_LEVEL_USER_WORK,
          payload: { [testActivityId]: testUserWork },
        })
      }

      // get currentItem index;
      let lastAttendedQuestion = 0
      if (lastAttemptedQuestion && lastAttemptedQuestion.testItemId) {
        test.testItems.forEach((item, index) => {
          if (item._id === lastAttemptedQuestion.testItemId) {
            lastAttendedQuestion = index
          }
        })
      }

      // if not the last question in the test or wasn't skipped then land on next Q
      if (
        lastAttendedQuestion !== test.testItems.length - 1 &&
        questionActivities.length &&
        !lastAttemptedQuestion.skipped
      ) {
        lastAttendedQuestion++
      }

      // load previous responses
      yield put({
        type: LOAD_ANSWERS,
        payload: allAnswers,
      })

      // only load from previous attempted if resuming from assignments page
      const loadFromLast = yield select(
        (state) => state.test && state.test.resume
      )

      // carryForward the prev locaation state in case of playlist flow
      const prevLocationState = yield select(
        (state) => state?.router?.location?.state
      ) || {}

      // move to last attended question
      if (
        !settings.blockNavigationToAnsweredQuestions &&
        !isFromSummary &&
        !summary
      ) {
        if (loadFromLast && testType !== testContants.type.TESTLET) {
          const itemId = testItemIds[lastAttendedQuestion]
          yield put(
            push({
              pathname: `${itemId}`,
              state: prevLocationState,
            })
          )
          yield put({
            type: SET_RESUME_STATUS,
            payload: false,
          })
        } else if (testType !== testContants.type.TESTLET) {
          yield put(
            push({
              pathname: `${testItemIds[0]}`,
              state: prevLocationState,
            })
          )
        }
      }
    }

    if (!isShowStudentWork) {
      testItems = markQuestionLabel(testItems)
    }
    let questions = getQuestions(testItems)
    if (test.passages) {
      const passageItems = test.passages.map((passage) => passage.data || [])
      questions = [...flatten(passageItems), ...questions]
    }
    yield put(
      loadQuestionsAction(
        _keyBy(questions, (q) =>
          q.type === 'passage' || q.type === 'video'
            ? q.id
            : `${q.testItemId}_${q.id}`
        )
      )
    )

    // test items are put into store after shuffling questions sometimes..
    // hence dont frigging move this, and this better stay at the end!

    yield put({
      type: LOAD_TEST_ITEMS,
      payload: {
        passages,
        items: testItems,
        title: test.title,
        testType: settings.testType || test.testType,
        playerSkinType: settings.playerSkinType || test.playerSkinType,
        testletConfig: test.testletConfig,
        annotations: test.annotations,
        docUrl: test.docUrl,
        isDocBased: test.isDocBased,
        pageStructure: test.pageStructure,
        freeFormNotes: test.freeFormNotes,
        settings,
        answerCheckByItemId,
        showMagnifier: settings.showMagnifier || test.showMagnifier,
        languagePreference: testActivity.testActivity?.languagePreference,
        grades: test.grades,
        subjects: test.subjects,
      },
    })
    if (preview) {
      yield put({
        type: UPDATE_PLAYER_PREVIEW_STATE,
        payload: {
          instruction: test.instruction,
          hasInstruction: test.hasInstruction,
          blockNavigationToAnsweredQuestions:
            test.blockNavigationToAnsweredQuestions,
          multiLanguageEnabled: test.multiLanguageEnabled,
        },
      })
      if (
        !(
          test.multiLanguageEnabled ||
          test.hasInstruction ||
          test.timedAssignment
        ) ||
        demo ||
        preview
      ) {
        yield put(setShowTestInfoSuccesAction(true))
      }
    }
    yield put(setPasswordValidateStatusAction(true))

    yield put({
      type: SET_TEST_LOADING_STATUS,
      payload: false,
    })
    sessionStorage.setItem('submitted', 'no')
    if (
      settings.blockNavigationToAnsweredQuestions &&
      testActivity.questionActivities.length &&
      !summary &&
      !test.isDocBased
    ) {
      const testItemIds = testItems.map((i) => i._id)
      let lastVisitedQuestion = testActivity.questionActivities[0]
      let lastVisitedItemIndex = 0
      testActivity.questionActivities.forEach((item) => {
        const itemIndex = testItemIds.indexOf(item.testItemId)
        if (itemIndex > testItemIds.indexOf(lastVisitedQuestion.testItemId)) {
          lastVisitedQuestion = item
          lastVisitedItemIndex = itemIndex
        }
      })

      const playerTestType =
        testType === testContants.type.COMMON
          ? testContants.type.ASSESSMENT
          : testType

      if (testItems.length === lastVisitedItemIndex + 1) {
        yield put(
          push(
            `/student/${playerTestType}/${testId}/class/${groupId}/uta/${testActivityId}/test-summary`
          )
        )
      } else {
        const itemId = testItems[lastVisitedItemIndex + 1]._id
        yield put(
          push(
            `/student/${playerTestType}/${testId}/class/${groupId}/uta/${testActivityId}/itemId/${itemId}`
          )
        )
      }
    }
  } catch (err) {
    captureSentryException(err)
    yield put({
      type: SET_TEST_LOADING_ERROR,
      payload: err,
    })

    if (preview) {
      if (getAccessToken()) {
        setTimeout(() => {
          window.location.href = '/author/tests'
        }, 3000)
        yield put(push('/author/tests'))
      } else {
        notification({ messageKey: 'youCanNoLongerUse' })
        setTimeout(() => {
          window.location.href = '/'
        }, 3000)
        return Modal.destroyAll()
      }
    }

    let messageKey = 'failedLoadingTest'

    if (err.status) {
      if (err.status === 400) {
        messageKey = 'invalidAction'
      } else if (err.status === 302) {
        messageKey = 'testPausedOrClosedByTeacher'
      } else if (err.status === 403) {
        if (userRole === roleuser.STUDENT || userRole === roleuser.PARENT) {
          const { data = {} } = err.response || {}
          const { message: errorMessage } = data
          notification({
            msg: errorMessage || 'Something went wrong!',
          })
          Fscreen.safeExitfullScreen()
          return yield put(push('/home/assignments'))
        }
        notification({
          msg: 'This test is marked private',
        })
      }
    }
    if (userRole === roleuser.STUDENT) {
      notification({ messageKey })
      Fscreen.safeExitfullScreen()
      return yield put(push('/home/assignments'))
    }
  }
}

// load users previous responses for a particular test
function* loadPreviousResponses(payload) {
  try {
    const { previousQuestionActivities } = payload
    yield put({
      type: LOAD_PREVIOUS_RESPONSES,
      payload: { previousQuestionActivities },
    })
  } catch (err) {
    console.log(err)
    captureSentryException(err)
  }
}

function* submitTest({ payload }) {
  try {
    const { itemResponse } = payload
    if (itemResponse) {
      const saveUserResponseActionObject = saveUserResponseAction(
        ...itemResponse
      )
      yield call(saveUserResponseSaga, saveUserResponseActionObject)
    }

    yield put({
      type: SET_SAVE_USER_RESPONSE,
      payload: true,
    })
    const [classId, preventRouteChange] =
      typeof payload === 'string'
        ? [payload]
        : [payload.groupId, payload.preventRouteChange]
    const testActivityInState = yield select(
      (state) => state.test && state.test.testActivityId
    )
    let testActivityId = payload.testActivityId || testActivityInState
    const groupId = classId || (yield select(getCurrentGroupWithAllClasses))

    // if no testActivityId, check in location
    const urlFragments = window.location.href.split('/').slice(-3)
    if (!testActivityId && urlFragments[0] === 'uta') {
      testActivityId = urlFragments[1]
    }

    if (testActivityId === 'test' || !testActivityId) {
      throw new Error('Unable to submit the test.')
    }

    const testLevelAttachments = yield select(getTestLevelUserWorkSelector)

    if ((testLevelAttachments || []).length) {
      const reqPayload = {
        testActivityId,
        groupId,
        userWork: { attachments: testLevelAttachments },
      }
      yield call(testActivityApi.saveUserWork, reqPayload)
    }

    yield testActivityApi.submit(testActivityId, groupId)
    // log the details on auto submit
    // if (payload.autoSubmit) {
    //   checkClientTime({ testActivityId, timedTest: true });
    // }
    const isCliUser = yield select((state) => state.user?.isCliUser)
    if (isCliUser) {
      window.parent.postMessage(
        JSON.stringify({ type: 'SUBMIT_ASSIGNMENT' }),
        '*'
      )
    }

    yield put({
      type: SET_TEST_ACTIVITY_ID,
      payload: { testActivityId: '' },
    })
    yield put({
      type: CLEAR_USER_WORK,
    })
    sessionStorage.removeItem('testAttemptReviewVistedId')
    if (navigator.userAgent.includes('SEB')) {
      return yield put(push('/student/seb-quit-confirm'))
    }
    const prevLocationState = yield select(
      (state) => state?.router?.location?.state
    )
    if (prevLocationState?.playlistRecommendationsFlow) {
      return yield put(
        push({
          pathname: `/home/playlist/${prevLocationState?.playlistId}/recommendations`,
          state: { currentGroupId: groupId },
        })
      )
    }
    if (prevLocationState?.playlistAssignmentFlow) {
      return yield put(
        push({
          pathname: `/home/playlist/${prevLocationState?.playlistId}`,
          state: { currentGroupId: groupId },
        })
      )
    }

    if (preventRouteChange) return
    const test = yield select((state) => state.test)

    if (isCliUser) {
      yield put(
        push(
          `/home/class/${groupId}/test/${
            test.testId
          }/testActivityReport/${testActivityId}${
            isCliUser ? '?cliUser=true' : ''
          }`
        )
      )
      return
    }

    const assignmentId = yield select(
      (state) => state.studentAssignment.current
    )

    // eslint-disable-next-line prefer-const
    let [assignment, testActivities] = yield Promise.all([
      assignmentApi.getById(assignmentId),
      assignmentApi.fetchTestActivities(assignmentId, groupId),
    ])
    const userId = yield select(getCurrentUserId)
    const classIds = yield select(getClassIds)
    const reportsGroupedByClassIdentifier = groupBy(
      testActivities,
      'assignmentClassIdentifier'
    )
    const groupedReportsByAssignmentId = groupBy(
      testActivities,
      (item) => `${item.assignmentId}_${item.groupId}`
    )
    assignment = transformAssignmentForRedirect(
      groupId,
      userId,
      classIds,
      reportsGroupedByClassIdentifier,
      groupedReportsByAssignmentId,
      assignment
    )
    const attempts = testActivities.filter((el) =>
      [testActivityStatus.ABSENT, testActivityStatus.SUBMITTED].includes(
        el.status
      )
    )
    let maxAttempt = assignment.class.find((item) => item._id == groupId)
      ?.maxAttempts
    if (!maxAttempt) {
      maxAttempt = assignment.maxAttempts || 1
    }

    sessionStorage.setItem('submitted', 'yes')

    if (attempts.length >= maxAttempt) {
      if (test.settings?.releaseScore === releaseGradeLabels.DONT_RELEASE) {
        return yield put(push(`/home/grades`))
      }
      return yield put(
        push(
          `/home/class/${groupId}/test/${test.testId}/testActivityReport/${testActivityId}`
        )
      )
    }
    return yield put(push(`/home/assignments`))
  } catch (err) {
    captureSentryException(err)
    const { data = {} } = err.response || {}
    const { message: errorMessage } = data
    if (err.status === 403) {
      if (errorMessage === 'assignment already submitted') {
        return yield put(push('/home/grades'))
      }
      yield put(push('/home/assignments'))
      yield put({
        type: SET_TEST_ACTIVITY_ID,
        payload: { testActivityId: '' },
      })
    }
    notification({
      msg: errorMessage || err.message || 'Something went wrong!',
    })
  } finally {
    yield put({
      type: SET_SAVE_USER_RESPONSE,
      payload: false,
    })
    yield put(setSelectedThemeAction('default'))
    yield put({
      type: RESET_TEST_ITEMS,
    })
    Fscreen.safeExitfullScreen()
  }
}

function* switchLanguage({ payload }) {
  try {
    const testActivityId = yield select(
      (state) => state.test && state.test.testActivityId
    )
    const { testActivity } = yield call(testActivityApi.switchLanguage, {
      testActivityId,
      ...payload,
    })
    const {
      groupId,
      testId,
      _id,
      itemsToDeliverInGroup,
      languagePreference,
    } = testActivity
    yield put(
      languageChangeSuccessAction({ languagePreference, testActivityId: _id })
    )
    const testType = yield select((state) => state.test && state.test.testType)
    const urlTestType =
      testType === testContants.type.COMMON
        ? testContants.type.ASSESSMENT
        : testType
    const firstItemId = itemsToDeliverInGroup[0].items[0]
    yield put(startAssessmentAction())
    yield put({
      type: LOAD_SCRATCH_PAD,
      payload: {},
    })
    yield put(utaStartTimeUpdateRequired(TIME_UPDATE_TYPE.START))
    yield put(push('/'))
    yield put(
      push({
        pathname: `/student/${urlTestType}/${testId}/class/${groupId}/uta/${_id}/itemId/${firstItemId}`,
        state: {
          switchLanguage: true,
        },
      })
    )
  } catch (err) {
    console.log(err)
    captureSentryException(err)
    notification({
      msg: err.response?.data?.message || 'Something went wrong!',
    })
  }
}

export default function* watcherSaga() {
  yield all([
    yield takeEvery(LOAD_TEST, loadTest),
    yield Effects.throttleAction(
      process.env.REACT_APP_QA_ENV ? 60000 : 10000,
      FINISH_TEST,
      submitTest
    ),
    yield takeEvery(LOAD_PREVIOUS_RESPONSES_REQUEST, loadPreviousResponses),
    yield takeLatest(SWITCH_LANGUAGE, switchLanguage),
  ])
}
