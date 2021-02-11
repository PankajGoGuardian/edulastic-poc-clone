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
} from 'redux-saga/effects'
import { Modal } from 'antd'
import {
  notification,
  Effects,
  captureSentryException,
} from '@edulastic/common'
import { push } from 'react-router-redux'
import {
  keyBy as _keyBy,
  groupBy,
  get,
  flatten,
  cloneDeep,
  set,
  isEmpty,
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
} from '../constants/actions'
import { saveUserResponse as saveUserResponseAction } from '../actions/items'
import { saveUserResponse as saveUserResponseSaga } from './items'
import { loadQuestionsAction } from '../actions/questions'
import { loadBookmarkAction } from '../sharedDucks/bookmark'
import {
  setPasswordValidateStatusAction,
  setPasswordStatusAction,
  languageChangeSuccessAction,
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
import { addAutoselectGroupItems } from '../../author/TestPage/ducks'
import { PREVIEW } from '../constants/constantsForQuestions'
import { getUserRole } from '../../author/src/selectors/user'
import {
  setActiveAssignmentAction,
  utaStartTimeUpdateRequired,
} from '../../student/sharedDucks/AssignmentModule/ducks'
import { getClassIds } from '../../student/Reports/ducks'
import { startAssessmentAction } from '../actions/assessment'
import { TIME_UPDATE_TYPE } from '../themes/common/TimedTestTimer'

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
      allQuestions.push(...questions, ...resources)
    }
  })

  return allQuestions
}

const getSettings = (test, testActivity, preview) => {
  const { assignmentSettings = {} } = testActivity || {}
  const calcType = !preview ? assignmentSettings.calcType : test.calcType
  // graphing calculator is not present for EDULASTIC so defaulting to DESMOS for now, below work around should be removed once EDULASTIC calculator is built
  const calcProvider =
    calcType === testContants.calculatorTypes.GRAPHING
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
    ? test.showMagnifier
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
    ? test.enableScratchpad
    : assignmentSettings.enableScratchpad
  const releaseScore = preview
    ? test.releaseScore
    : testActivity?.testActivity?.releaseScore

  return {
    testType,
    calcProvider,
    playerSkinType,
    showMagnifier,
    timedAssignment,
    allowedTime,
    pauseAllowed,
    enableScratchpad,
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

function* loadTest({ payload }) {
  const {
    testActivityId,
    testId,
    preview = false,
    demo = false,
    test: testData = {},
    groupId: groupIdFromUrl,
    isShowStudentWork = false,
    playlistId,
    currentAssignmentId,
  } = payload
  try {
    if (!preview && !testActivityId) {
      // we don't have a testActivityId for non-preview, lets throw error to short circuit
      throw new Error(
        'Unable to load the test. Please contact Edulastic Support'
      )
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

    yield put({
      type: SET_TEST_ID,
      payload: {
        testId,
      },
    })

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
    const testRequest = !demo
      ? call(preview ? testsApi.getById : testsApi.getByIdMinimal, testId, {
          validation: true,
          data: true,
          groupId,
          testActivityId,
          ...(playlistId ? { playlistId } : {}),
          ...(currentAssignmentId ? { assignmentId: currentAssignmentId } : {}),
        }) // when preview(author side) use normal non cached api
      : call(testsApi.getPublicTest, testId)
    const _response = yield all([getTestActivity])
    const testActivity = _response?.[0] || {}
    const isFromSummary = yield select((state) =>
      get(state, 'router.location.state.fromSummary', false)
    )
    if (!preview) {
      /**
       * src/client/assessment/sagas/items.js:saveUserResponse
       * requires current assignment id in store (studentAssignment.current)
       */
      const { assignmentId } = testActivity?.testActivity || {}
      if (assignmentId) {
        yield put(setActiveAssignmentAction(assignmentId))
      }

      let passwordValidated =
        testActivity?.assignmentSettings?.passwordPolicy ===
          testContants?.passwordPolicy?.REQUIRED_PASSWORD_POLICY_OFF ||
        isFromSummary
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
    test.testItems = test.itemGroups.flatMap(
      (itemGroup) => itemGroup.items || []
    )
    if (
      testActivity?.assignmentSettings?.questionsDelivery ===
        testContants.redirectPolicy.QuestionDelivery.SKIPPED_AND_WRONG &&
      testActivity.itemsToBeExcluded?.length
    ) {
      // mutating to filter the excluded items as the settings is to show SKIPPED AND WRONG
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
      const assignmentObj = assignmentById[activity.assignmentId]
      if (assignmentObj?.restrictNavigationOut && isiOS()) {
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

      previousQuestionActivities.forEach((item) => {
        allPrevAnswers = {
          ...allPrevAnswers,
          [item.qid]: item.userResponse,
        }
        allEvaluation = {
          ...allEvaluation,
          [item.qid]: item.evaluation,
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

      const testItemIds = testItems.map((i) => i._id)
      const { attachments = [] } = yield call(
        attachmentApi.loadAllAttachments,
        {
          referrerId: testActivityId,
        }
      )
      const scratchPadData = getScratchpadDataFromAttachments(attachments)
      questionActivities.forEach((item) => {
        allAnswers = {
          ...allAnswers,
          [item.qid]: item.userResponse,
        }
        if (item.scratchPad) {
          scratchPadData[item.testItemId] = {
            ...item.scratchPad,
            ...scratchPadData[item.testItemId],
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
        yield put({
          type: LOAD_SCRATCH_PAD,
          payload: scratchPadData,
        })
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
      if (!settings.blockNavigationToAnsweredQuestions && !isFromSummary) {
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
    yield put(loadQuestionsAction(_keyBy(questions, 'id')))

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
      },
    })
    yield put(setPasswordValidateStatusAction(true))

    yield put({
      type: SET_TEST_LOADING_STATUS,
      payload: false,
    })

    if (
      settings.blockNavigationToAnsweredQuestions &&
      testActivity.questionActivities.length &&
      !test.isDocBased
    ) {
      let questionIndex = 0
      const qActivitiesSorted = testActivity.questionActivities.sort((a, b) => {
        if (a.qLabel > b.qLabel) return 1
        return -1
      })
      for (let i = 0; i < qActivitiesSorted.length; i++) {
        const qActivity = qActivitiesSorted[i]
        if (qActivity.qLabel.includes(`Q${i + 1}`)) {
          questionIndex++
        }
      }
      if (testItems.length === questionIndex) {
        yield put(
          push(
            `/student/${testType}/${testId}/class/${groupId}/uta/${testActivityId}/test-summary`
          )
        )
      } else {
        const itemId = testItems[questionIndex]._id
        yield put(
          push(
            `/student/${testType}/${testId}/class/${groupId}/uta/${testActivityId}/itemId/${itemId}`
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
      notification({ messageKey: 'youCanNoLongerUse' })
      return Modal.destroyAll()
    }

    let messageKey = 'failedLoadingTest'
    const userRole = yield select(getUserRole)

    if (err.status) {
      if (err.status === 400) {
        messageKey = 'invalidAction'
      } else if (err.status === 302) {
        messageKey = 'testPausedOrClosedByTeacher'
      } else if (err.status === 403) {
        if (userRole === roleuser.STUDENT) {
          const { data = {} } = err.response || {}
          const { message: errorMessage } = data
          notification({
            msg: errorMessage || 'Something went wrong!',
          })
          Fscreen.exitFullscreen()
          return yield put(push('/home/assignments'))
        }
      }
    }
    if (userRole === roleuser.STUDENT) {
      notification({ messageKey })
      Fscreen.exitFullscreen()
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
    const firstItemId = itemsToDeliverInGroup[0].items[0]
    yield put(startAssessmentAction())
    yield put(utaStartTimeUpdateRequired(TIME_UPDATE_TYPE.START))
    yield put(push('/'))
    yield put(
      push(
        `/student/${testType}/${testId}/class/${groupId}/uta/${_id}/itemId/${firstItemId}`
      )
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
    yield Effects.throttleAction(10000, FINISH_TEST, submitTest),
    yield takeEvery(LOAD_PREVIOUS_RESPONSES_REQUEST, loadPreviousResponses),
    yield takeLatest(SWITCH_LANGUAGE, switchLanguage),
  ])
}
