import { delay } from 'redux-saga'
import {
  takeEvery,
  call,
  put,
  all,
  takeLatest,
  select,
  fork,
  actionChannel,
  take,
} from 'redux-saga/effects'
import {
  classResponseApi,
  testActivityApi,
  attchmentApi as attachmentApi,
} from '@edulastic/api'
import { questionType } from '@edulastic/constants'
import { createAction } from 'redux-starter-kit'
import { notification } from '@edulastic/common'
import { get, isEmpty, groupBy, isPlainObject } from 'lodash'

import {
  RECEIVE_CLASS_RESPONSE_REQUEST,
  RECEIVE_CLASS_RESPONSE_SUCCESS,
  RECEIVE_CLASS_RESPONSE_ERROR,
  RECEIVE_STUDENT_RESPONSE_REQUEST,
  RECEIVE_STUDENT_RESPONSE_SUCCESS,
  RECEIVE_STUDENT_RESPONSE_ERROR,
  RECEIVE_CLASSSTUDENT_RESPONSE_REQUEST,
  RECEIVE_CLASSSTUDENT_RESPONSE_SUCCESS,
  RECEIVE_CLASSSTUDENT_RESPONSE_ERROR,
  RECEIVE_FEEDBACK_RESPONSE_REQUEST,
  RECEIVE_FEEDBACK_RESPONSE_SUCCESS,
  RECEIVE_FEEDBACK_RESPONSE_ERROR,
  RECEIVE_STUDENT_QUESTION_REQUEST,
  RECEIVE_STUDENT_QUESTION_SUCCESS,
  RECEIVE_STUDENT_QUESTION_ERROR,
  RECEIVE_CLASS_QUESTION_REQUEST,
  RECEIVE_CLASS_QUESTION_SUCCESS,
  RECEIVE_CLASS_QUESTION_ERROR,
  RESPONSE_ENTRY_SCORE_SUCCESS,
  UPDATE_STUDENT_TEST_ITEMS,
} from '../src/constants/actions'
import { gradebookTestItemAddAction } from '../src/reducers/testActivity'

import {
  markQuestionLabel,
  transformGradeBookResponse,
} from '../ClassBoard/Transformer'
import { setTeacherEditedScore } from '../ExpressGrader/ducks'
import { setCurrentTestActivityIdAction } from '../src/actions/classBoard'
import { hasRandomQuestions } from '../ClassBoard/utils'
import { SAVE_USER_WORK } from '../../assessment/constants/actions'

// action
export const UPDATE_STUDENT_ACTIVITY_SCORE =
  '[classResponse] update student activity score'

// action creators
export const updateStudentQuestionActivityScoreAction = createAction(
  UPDATE_STUDENT_ACTIVITY_SCORE
)

function* receiveClassResponseSaga({ payload }) {
  try {
    const classResponse = yield call(classResponseApi.classResponse, payload)
    classResponse.testItems = classResponse.itemGroups.flatMap(
      (itemGroup) => itemGroup.items || []
    )
    markQuestionLabel(classResponse.testItems)
    yield put({
      type: RECEIVE_CLASS_RESPONSE_SUCCESS,
      payload: classResponse,
    })
  } catch (err) {
    const errorMessage = 'Unable to retrieve class information.'
    notification({ type: 'error', msg: errorMessage })
    yield put({
      type: RECEIVE_CLASS_RESPONSE_ERROR,
      payload: { error: errorMessage },
    })
  }
}

function* loadAttachmentsFromServer(filter) {
  try {
    const { referrerId, referrerId2, uqaId } = filter
    // TODO
    // perf optimisation
    // call the api only if data is not present in the store
    const { attachments = [] } = yield call(attachmentApi.loadAllAttachments, {
      referrerId,
      referrerId2,
    })
    const scratchpadData = {}
    for (const attachment of attachments) {
      const { data } = attachment
      scratchpadData[uqaId] = data.scratchpad
    }
    yield put({ type: SAVE_USER_WORK, payload: scratchpadData })
  } catch (error) {
    console.error('error from attachmentAPI', error)
  }
}

function* getAttachmentsForItems({ testActivityId, testItemsIdArray = [] }) {
  yield all(
    testItemsIdArray.map(({ testItemId, uqaId }) =>
      call(loadAttachmentsFromServer, {
        referrerId: testActivityId,
        referrerId2: testItemId,
        uqaId,
      })
    )
  )
}

function* loadPassageHighlightFromServer({ referrerId, referrerId2 }) {
  try {
    const { attachments = [] } = yield call(attachmentApi.loadAllAttachments, {
      referrerId,
      referrerId2,
    })
    const passageData = {}
    for (const attachment of attachments) {
      const { data } = attachment
      passageData[referrerId2] = data
    }
    yield put({ type: SAVE_USER_WORK, payload: passageData })
  } catch (error) {
    console.log('error from attachmentAPI', error)
  }
}

function* loadPassagesForItems({ testActivityId, passages }) {
  yield all(
    passages.map((passage) =>
      call(loadPassageHighlightFromServer, {
        referrerId: testActivityId,
        referrerId2: passage._id,
      })
    )
  )
}

function getScratchpadUsedItemsFromActivities(actGroups = {}) {
  const items = []
  Object.keys(actGroups).forEach((key) => {
    const activities = actGroups[key]
    let showScratchByDefault
    let scratchUsed
    for (const activity of activities) {
      if (activity.qType === questionType.HIGHLIGHT_IMAGE) {
        showScratchByDefault = true
      }
      if (activity?.scratchPad?.scratchpad === true) {
        scratchUsed = true
      }
      if (scratchUsed && showScratchByDefault) {
        break
      }
    }
    if (scratchUsed && showScratchByDefault) {
      items.push({
        utaId: activities[0].testActivityId,
        uqaId: activities[0]._id,
        testItemId: key,
      })
    }
  })
  return items
}

function* receiveStudentResponseSaga({ payload }) {
  try {
    const studentResponse = yield call(
      classResponseApi.studentResponse,
      payload
    )
    const { questionActivities = [] } = studentResponse

    // student view LCB
    const actGroups = groupBy(questionActivities, 'testItemId')
    const scratchpadUsedItems = getScratchpadUsedItemsFromActivities(actGroups)

    yield fork(getAttachmentsForItems, {
      testActivityId: payload.testActivityId,
      testItemsIdArray: scratchpadUsedItems,
    })

    const originalData = yield select(
      (state) => state.author_classboard_testActivity?.data
    )
    const passages = get(originalData, 'test.passages', [])

    if (!isEmpty(passages)) {
      yield fork(loadPassagesForItems, {
        testActivityId: payload.testActivityId,
        passages,
      })
    }
    // AUTOSELECT group will have different questions for every student
    // hence update the items from student response api
    if (hasRandomQuestions(originalData.test.itemGroups)) {
      const itemGroups = originalData.test.itemGroups.map((group) => ({
        ...group,
        items: studentResponse.itemGroups[group._id] || [],
      }))
      const testItems = itemGroups.flatMap((itemGroup) => itemGroup.items || [])
      markQuestionLabel(testItems)
      originalData.test.itemGroups = itemGroups
      originalData.test.testItems = testItems
      originalData.testItemsData = testItems
      yield put({
        type: UPDATE_STUDENT_TEST_ITEMS,
        payload: { testItems, itemGroups },
      })
      yield put(setCurrentTestActivityIdAction(payload.testActivityId))
    }
    /**
     * transforming questionActivities to support chart/question labels, etc.,
     */
    const serverTimeStamp = yield select((state) =>
      get(state, 'author_classboard_testActivity.additionalData.ts', Date.now())
    )
    const transformed = transformGradeBookResponse(
      {
        ...originalData,
        testActivities: [studentResponse.testActivity],
        testQuestionActivities: studentResponse.questionActivities,
        ts: serverTimeStamp,
      },
      true
    )
    const transformedQuestionActivities = transformed.find(
      (x) => x.studentId === payload.studentId
    )?.questionActivities
    studentResponse.questionActivities = transformedQuestionActivities

    const userWork = {}

    transformedQuestionActivities.forEach((item) => {
      if (item.scratchPad) {
        const newUserWork = { ...item.scratchPad }
        userWork[item.testItemId] = newUserWork
      }
    })
    if (Object.keys(userWork).length > 0) {
      yield put({
        type: SAVE_USER_WORK,
        payload: userWork,
      })
    }

    yield put({
      type: RECEIVE_STUDENT_RESPONSE_SUCCESS,
      payload: studentResponse,
    })
  } catch (err) {
    console.log('err is', err)
    const errorMessage = 'Unable to retrieve student response.'
    notification({ type: 'error', messageKey: 'receiveTestFailing' })
    yield put({
      type: RECEIVE_STUDENT_RESPONSE_ERROR,
      payload: { error: errorMessage },
    })
  }
}

function* receiveClassStudentResponseSaga({ payload }) {
  try {
    const classStudentResponse = []
    for (let i = 0; i < payload.selectedActivities.length; i++) {
      classStudentResponse.push(
        yield call(classResponseApi.studentResponse, {
          testActivityId: payload.selectedActivities[i],
          groupId: payload.groupId,
        })
      )
    }
    yield put({
      type: RECEIVE_CLASSSTUDENT_RESPONSE_SUCCESS,
      payload: classStudentResponse,
    })
  } catch (err) {
    const errorMessage = 'Unable to retrieve class student response.'
    notification({ type: 'error', messageKey: 'receiveTestFailing' })
    yield put({
      type: RECEIVE_CLASSSTUDENT_RESPONSE_ERROR,
      payload: { error: errorMessage },
    })
  }
}

function* receiveFeedbackResponseSaga({ payload }) {
  yield delay(1000)
  try {
    const {
      testActivityId,
      itemId,
      studentId,
      questionId,
      body: { groupId, feedback },
    } = payload

    const feedbackResponse = yield call(
      testActivityApi.updateQuestionFeedBack,
      {
        testActivityId,
        questionId,
        feedback,
        groupId,
        itemId,
      }
    )

    yield put({
      type: RECEIVE_FEEDBACK_RESPONSE_SUCCESS,
      payload: feedbackResponse,
    })
    yield put({
      type: RECEIVE_STUDENT_RESPONSE_REQUEST,
      payload: { testActivityId, groupId, studentId },
    })
    notification({ type: 'success', messageKey: 'feedbackSuccessfullyUpdate' })
  } catch (err) {
    console.error(err)
    const errorMessage = 'Unable to retrieve feedback response.'
    notification({ type: 'error', messageKey: 'receiveTestFailing' })
    yield put({
      type: RECEIVE_FEEDBACK_RESPONSE_ERROR,
      payload: { error: errorMessage },
    })
  }
}

function* receiveStudentQuestionSaga({ payload }) {
  try {
    // express grader
    let feedbackResponse
    if (payload.testItemId) {
      feedbackResponse = yield call(
        classResponseApi.receiveStudentItemQuestionResponse,
        payload
      )
    } else {
      feedbackResponse = yield call(
        classResponseApi.receiveStudentQuestionResponse,
        payload
      )
      const { qid, score, autoGrade } = feedbackResponse || {}
      if (!autoGrade) {
        yield put(setTeacherEditedScore({ [qid]: score }))
      }
    }

    if (feedbackResponse) {
      const scratchpadUsedItems = []
      if (Array.isArray(feedbackResponse)) {
        // multipart item
        const scratchpadUsed = (obj) => obj?.scratchPad?.scratchpad === true
        const idObjMapper = (obj) => {
          const { _id: uqaId, testItemId, testActivityId } = obj
          return { uqaId, testItemId, testActivityId }
        }
        const [item] = feedbackResponse.filter(scratchpadUsed).map(idObjMapper)
        if (item) {
          scratchpadUsedItems.push(item)
        }
      } else if (isPlainObject(feedbackResponse)) {
        // item having single question
        const {
          qType,
          scratchPad,
          _id: uqaId,
          testItemId,
          testActivityId,
        } = feedbackResponse
        if (
          qType === questionType.HIGHLIGHT_IMAGE &&
          scratchPad.scratchpad === true
        ) {
          scratchpadUsedItems.push({ uqaId, testItemId, testActivityId })
        }
      }
      if (scratchpadUsedItems.length > 0) {
        yield fork(getAttachmentsForItems, {
          testActivityId: scratchpadUsedItems[0].testActivityId,
          testItemsIdArray: scratchpadUsedItems,
        })
      }
    }

    const originalData = yield select(
      (state) => state.author_classboard_testActivity?.data
    )
    const passages = get(originalData, 'test.passages', [])

    if (!isEmpty(passages) && feedbackResponse) {
      yield fork(loadPassagesForItems, {
        testActivityId: feedbackResponse.testActivityId,
        passages,
      })
    }

    yield put({
      type: RECEIVE_STUDENT_QUESTION_SUCCESS,
      payload: feedbackResponse,
    })
  } catch (err) {
    console.error(err)
    const errorMessage = 'Unable to retrieve student response.'
    notification({ msg: errorMessage })
    yield put({
      type: RECEIVE_STUDENT_QUESTION_ERROR,
      payload: { error: errorMessage },
    })
  }
}

function* receiveClassQuestionSaga({ payload }) {
  // question view LCB
  try {
    let feedbackResponse
    if (payload.testItemId || payload.itemId) {
      feedbackResponse = yield call(
        classResponseApi.questionClassItemQuestionResponse,
        payload
      )
    } else {
      feedbackResponse = yield call(
        classResponseApi.questionClassQuestionResponse,
        payload
      )
    }

    let scratchpadUsedItems = []
    const actGroupByUser = groupBy(feedbackResponse, 'userId')

    Object.keys(actGroupByUser).forEach((key) => {
      const groupByItem = groupBy(actGroupByUser[key], 'testItemId')
      const curritems = getScratchpadUsedItemsFromActivities(groupByItem)
      scratchpadUsedItems = scratchpadUsedItems.concat(curritems)
    })

    for (const item of scratchpadUsedItems) {
      yield fork(getAttachmentsForItems, {
        testActivityId: item.utaId,
        testItemsIdArray: [item],
      })
    }
    feedbackResponse = feedbackResponse.map((x) => {
      if (x.graded === false) {
        Object.assign(x, { score: 0 })
      }
      return x
    })
    yield put({
      type: RECEIVE_CLASS_QUESTION_SUCCESS,
      payload: feedbackResponse,
    })
  } catch (err) {
    const errorMessage = 'Unable to retrieve the class question info.'
    notification({ msg: errorMessage })
    yield put({
      type: RECEIVE_CLASS_QUESTION_ERROR,
      payload: { error: errorMessage },
    })
  }
}

function* updateStudentScore(payload) {
  try {
    const {
      testActivityId,
      itemId,
      questionId,
      userResponse,
      score,
      groupId,
      studentId,
      shouldReceiveStudentResponse = false,
    } = payload

    const scoreRes = yield call(testActivityApi.updateResponseEntryAndScore, {
      testActivityId,
      itemId,
      groupId,
      userResponse,
      scores: { [questionId]: score },
    })

    const { questionActivities, testActivity } = scoreRes
    const gradeBookTestItemAddPayload = []
    for (const {
      qid: _id,
      score: _score,
      maxScore,
      testActivityId: _testActivityId,
      graded,
      skipped,
      ...question
    } of questionActivities) {
      gradeBookTestItemAddPayload.push({
        testActivityId: _testActivityId,
        score: _score,
        maxScore,
        graded,
        skipped,
        ...question,
        _id,
      })
    }

    yield put(gradebookTestItemAddAction(gradeBookTestItemAddPayload))
    yield put({
      type: RESPONSE_ENTRY_SCORE_SUCCESS,
      payload: { questionActivities, testActivity },
    })

    // should run only when score gets updated
    if (shouldReceiveStudentResponse) {
      yield put({
        type: RECEIVE_STUDENT_RESPONSE_REQUEST,
        payload: { testActivityId, groupId, studentId },
      })
    }

    notification({ type: 'success', messageKey: 'scoreSucessfullyUpdated' })
  } catch (e) {
    console.log(e)
    notification({ messageKey: 'scoreUpdationFailed' })
  }
}

export function* watcherSaga() {
  yield all([
    yield takeEvery(RECEIVE_CLASS_RESPONSE_REQUEST, receiveClassResponseSaga),
    yield takeEvery(
      RECEIVE_STUDENT_QUESTION_REQUEST,
      receiveStudentQuestionSaga
    ),
    yield takeEvery(
      RECEIVE_CLASSSTUDENT_RESPONSE_REQUEST,
      receiveClassStudentResponseSaga
    ),
    yield takeEvery(RECEIVE_CLASS_QUESTION_REQUEST, receiveClassQuestionSaga),
    yield takeEvery(
      RECEIVE_STUDENT_RESPONSE_REQUEST,
      receiveStudentResponseSaga
    ),
    yield takeLatest(
      RECEIVE_FEEDBACK_RESPONSE_REQUEST,
      receiveFeedbackResponseSaga
    ),
  ])
  const requestChan = yield actionChannel(UPDATE_STUDENT_ACTIVITY_SCORE)
  while (true) {
    const { payload } = yield take(requestChan)
    yield call(updateStudentScore, payload)
  }
}
