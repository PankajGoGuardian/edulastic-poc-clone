import { takeLatest, call, put, all, select } from 'redux-saga/effects'
import { push } from 'connected-react-router'
import {
  uploadToS3,
  notification,
  Effects,
  captureSentryException,
} from '@edulastic/common'
import { maxBy, isEmpty } from 'lodash'
import {
  itemsApi,
  testItemActivityApi,
  attchmentApi as attachmentApi,
  testActivityApi,
} from '@edulastic/api'
import { assignmentPolicyOptions, aws } from '@edulastic/constants'

import { getCurrentGroupWithAllClasses } from '../../student/Login/ducks'
import {
  RECEIVE_ITEM_REQUEST,
  RECEIVE_ITEM_SUCCESS,
  RECEIVE_ITEM_ERROR,
  SAVE_USER_RESPONSE,
  SAVE_USER_RESPONSE_SUCCESS,
  SAVE_USER_RESPONSE_ERROR,
  LOAD_USER_RESPONSE,
  LOAD_ANSWERS,
  CLEAR_USER_WORK,
  CLEAR_HINT_USAGE,
} from '../constants/actions'
import { getPreviousAnswersListSelector } from '../selectors/answers'
import { redirectPolicySelector } from '../selectors/test'
import { getServerTs } from '../../student/utils'
import { utaStartTimeUpdateRequired } from '../../student/sharedDucks/AssignmentModule/ducks'
import {
  scratchpadDomRectSelector,
  resetScratchpadDimensionsAction,
} from '../../common/components/Scratchpad/duck'

const {
  POLICY_CLOSE_MANUALLY_BY_ADMIN,
  POLICY_CLOSE_MANUALLY_IN_CLASS,
} = assignmentPolicyOptions

const manuallyClosePolicies = [
  POLICY_CLOSE_MANUALLY_IN_CLASS,
  POLICY_CLOSE_MANUALLY_BY_ADMIN,
]

const defaultUploadFolder = aws.s3Folders.DEFAULT

function* receiveItemSaga({ payload }) {
  try {
    const item = yield call(itemsApi.receiveItemById, payload.id)

    yield put({
      type: RECEIVE_ITEM_SUCCESS,
      payload: { item },
    })
  } catch (err) {
    captureSentryException(err)
    console.error(err)
    yield put({
      type: RECEIVE_ITEM_ERROR,
      payload: {
        error: 'Unable to retrieve the item. Please contact support.',
      },
    })
  }
}

// fetch all questionIds from item
export const getQuestionIds = (item) => {
  let questions = []
  item.rows &&
    item.rows.forEach((row) => {
      questions = [
        ...questions,
        ...row.widgets.map((widget) => widget.reference),
      ].filter((q) => !!q)
    })

  return questions
}

export function* saveUserResponse({ payload }) {
  try {
    const ts = payload.timeSpent || 0
    const {
      autoSave,
      shouldClearUserWork = false,
      isPlaylist = false,
      callback,
      pausing,
      questionId,
      extData,
    } = payload
    const itemIndex = payload.itemId
    const assignmentsByIds = yield select(
      (state) => state.studentAssignment && state.studentAssignment.byId
    )
    const assignmentId = yield select(
      (state) => state.studentAssignment && state.studentAssignment.current
    )
    const groupId =
      payload.groupId || (yield select(getCurrentGroupWithAllClasses))
    // eslint-disable-next-line prefer-const
    const assignment = assignmentsByIds[assignmentId] || {}
    let { endDate } = assignment
    const { closePolicy } = assignment
    const { class: clazz = [] } = assignment
    const serverTimeStamp = getServerTs(assignment)

    const timedAssignment = yield select(
      (state) => state.test?.settings?.timedAssignment
    )
    if (pausing && timedAssignment) {
      const utaId = yield select((state) => state.test.testActivityId)
      if (utaId) {
        yield call(testActivityApi.updateUtaTime, { utaId, type: 'pausing' })
        yield put(utaStartTimeUpdateRequired(null))
      }
    }

    if (!endDate && clazz.length) {
      endDate = (
        maxBy(
          clazz.filter((cl) => cl._id === groupId),
          'endDate'
        ) || {}
      ).endDate
      if (!endDate) {
        endDate = (
          maxBy(
            clazz.filter((cl) => cl._id === groupId),
            'closedDate'
          ) || {}
        ).closedDate
      }
    }
    /**
     * Expiry date for the assignment
     * for manuallyClosePolicies Expiry date check is not required
     */

    if (
      !manuallyClosePolicies.includes(closePolicy) &&
      endDate &&
      endDate < serverTimeStamp
    ) {
      notification({ messageKey: 'testTimeEnded' })
      if (isPlaylist)
        return yield put(push(`/home/playlist/${isPlaylist?.playlistId}`))
      return yield put(push('/home/assignments'))
    }
    const items = yield select((state) => state.test && state.test.items)
    const answers = yield select((state) => state.answers)
    // prevent autSave if response is empty for every question in current item
    if (
      autoSave &&
      answers &&
      Object.values(answers).every(
        (ans) => typeof ans !== 'number' && isEmpty(ans)
      )
    ) {
      return
    }
    const {
      testActivityId: userTestActivityId,
      passages,
      isDocBased,
    } = yield select((state) => state.test)
    const shuffledOptions = yield select((state) => state.shuffledOptions)
    // passages: state.test.passages
    const currentItem = items.length && items[itemIndex]
    if (!userTestActivityId || !currentItem) {
      return
    }
    let passage = {}
    if (currentItem.passageId && passages) {
      passage = passages.find((p) => p._id === currentItem.passageId)
    }
    const passageId = passage._id

    const questions = getQuestionIds(currentItem)
    const bookmarked = !!(yield select(
      (state) => state.assessmentBookmarks[currentItem._id]
    ))
    const userPrevAnswer = yield select(getPreviousAnswersListSelector)
    const redirectPolicy = yield select(redirectPolicySelector)
    const itemAnswers = {}
    const shuffles = {}
    const timesSpent = {}
    questions.forEach((question) => {
      if (isDocBased) {
        if (questionId && question === questionId) {
          timesSpent[questionId] = ts
        } else {
          timesSpent[question] = 0
        }
      } else {
        timesSpent[question] = ts / questions.length
      }
      itemAnswers[question] = answers[question]
      // Redirect flow user hasnt selected new answer for this question.
      // check this only for policy "STUDENT_RESPONSE_AND_FEEDBACK"
      const {
        STUDENT_RESPONSE_AND_FEEDBACK,
        SCORE_RESPONSE_AND_FEEDBACK,
      } = assignmentPolicyOptions.showPreviousAttemptOptions
      const hasPrevResponse = [
        STUDENT_RESPONSE_AND_FEEDBACK,
        SCORE_RESPONSE_AND_FEEDBACK,
      ].includes(redirectPolicy)
      if (hasPrevResponse && !answers[question] && !!userPrevAnswer[question]) {
        itemAnswers[question] = userPrevAnswer[question]
      }
      if (shuffledOptions[question]) {
        shuffles[question] = shuffledOptions[question]
      }
    })

    const testItemId = currentItem._id
    const _userWork = yield select(
      ({ userWork }) => userWork.present[testItemId] || {}
    )
    const userInteractions = yield select(
      ({ userInteractions: _userInteractions }) => _userInteractions[testItemId]
    )
    const activity = {
      answers: itemAnswers,
      testItemId,
      assignmentId,
      testActivityId: userTestActivityId,
      groupId,
      interactions: userInteractions,
      timesSpent,
      shuffledOptions: shuffles,
      bookmarked,
    }

    if (!isEmpty(extData)) {
      activity.extData = extData
    }

    let userWorkData = { ..._userWork, scratchpad: false }
    let shouldSaveOrUpdateAttachment = false
    const scratchPadUsed = !isEmpty(_userWork?.scratchpad)

    if (scratchPadUsed) {
      const dimensions = yield select(scratchpadDomRectSelector)
      userWorkData = { ...userWorkData, scratchpad: true, dimensions }
      shouldSaveOrUpdateAttachment = true
    }
    activity.userWork = userWorkData
    yield call(testItemActivityApi.create, activity, autoSave, pausing)
    const userId = yield select((state) => state?.user?.user?._id)
    if (shouldSaveOrUpdateAttachment) {
      const fileData = isDocBased
        ? { ..._userWork.scratchpad, name: `${userTestActivityId}_${userId}` }
        : _userWork.scratchpad
      const scratchpadUri = yield call(
        uploadToS3,
        fileData,
        defaultUploadFolder
      )
      const update = {
        data: { scratchpad: scratchpadUri },
        referrerId: userTestActivityId,
        userId,
        type: 'scratchpad',
        referrerType: 'TestActivityContent',
        referrerId2: testItemId,
        status: 'published',
      }
      const filter = {
        referrerId: userTestActivityId,
        referrerId2: testItemId,
      }
      yield call(attachmentApi.updateAttachment, { update, filter })
    }
    if (passageId) {
      const highlights = yield select(
        ({ userWork }) => userWork.present[passageId]?.resourceId
      )
      if (highlights) {
        const update = {
          data: { resourceId: highlights },
          referrerId: userTestActivityId,
          userId,
          type: 'passage',
          referrerType: 'TestItemContent',
          referrerId2: passageId,
          status: 'published',
        }
        const filter = {
          referrerId: userTestActivityId,
          referrerId2: passageId,
        }
        yield call(attachmentApi.updateAttachment, { update, filter })
      }
    }
    yield put({ type: SAVE_USER_RESPONSE_SUCCESS })
    yield put({
      type: CLEAR_HINT_USAGE,
    })
    if (payload?.urlToGo) {
      yield put(push({ pathname: payload.urlToGo, state: payload?.locState }))
    }
    yield put(resetScratchpadDimensionsAction())
    if (shouldClearUserWork) {
      /**
       * if we have two assignments one for practice
       * and one for class assignment with same questions
       * need to clear user work in store after we click save and exit button
       * otherwise the store data remains and it is shown in the other assignment
       */
      yield put({
        type: CLEAR_USER_WORK,
      })
    }
    if (callback) {
      yield call(callback)
    }
  } catch (err) {
    yield put({ type: SAVE_USER_RESPONSE_ERROR })
    console.log(err)
    captureSentryException(err)
    if (err.status === 403) {
      const { isPlaylist = false } = payload
      if (isPlaylist)
        return yield put(push(`/home/playlist/${isPlaylist?.playlistId}`))
      yield put(push('/home/assignments'))
      notification({ msg: err.response.data })
    } else {
      notification({ messageKey: 'failedSavingAnswer' })
    }
    // yield call(message.error, "Failed saving the Answer");
  }
}

function* loadUserResponse({ payload }) {
  try {
    const itemIndex = payload.itemId
    const items = yield select((state) => state.test && state.test.items)
    const item = items[itemIndex]
    const { answers } = yield call(itemsApi.getUserResponse, item._id)
    yield put({
      type: LOAD_ANSWERS,
      payload: {
        ...answers,
      },
    })
  } catch (e) {
    captureSentryException(e)
    notification({ messageKey: 'failedLoadingAnswer' })
  }
}

export default function* watcherSaga() {
  yield all([
    yield takeLatest(RECEIVE_ITEM_REQUEST, receiveItemSaga),
    yield Effects.throttleAction(8000, SAVE_USER_RESPONSE, saveUserResponse),
    yield takeLatest(LOAD_USER_RESPONSE, loadUserResponse),
  ])
}
