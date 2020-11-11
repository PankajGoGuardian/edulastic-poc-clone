import { takeEvery, put, all, select, call } from 'redux-saga/effects'
import { isEmpty, values } from 'lodash'

import { testItemsApi, attchmentApi as attachmentApi } from '@edulastic/api'
import {
  captureSentryException,
  notification,
  uploadToS3,
} from '@edulastic/common'
import { aws } from '@edulastic/constants'

import { getQuestionIds } from './items'
// actions
import {
  CHECK_ANSWER_EVALUATION,
  ADD_ITEM_EVALUATION,
  CLEAR_ITEM_EVALUATION,
  COUNT_CHECK_ANSWER,
  SET_CHECK_ANSWER_PROGRESS_STATUS,
} from '../constants/actions'
import { itemQuestionsSelector, answersForCheck } from '../selectors/test'
import { CHANGE_PREVIEW, CHANGE_VIEW } from '../../author/src/constants/actions'
import { getTypeAndMsgBasedOnScore } from '../../common/utils/helpers'
import { scratchpadDomRectSelector } from '../../common/components/Scratchpad/duck'

function* evaluateAnswers({ payload: groupId }) {
  try {
    yield put({
      type: CLEAR_ITEM_EVALUATION,
    })
    yield put({ type: SET_CHECK_ANSWER_PROGRESS_STATUS, payload: true })
    const questionIds = yield select(itemQuestionsSelector)
    const allAnswers = yield select(answersForCheck)
    const answerIds = Object.keys(allAnswers)
    const userResponse = {}
    const testActivityId = yield select(
      (state) => state.test && state.test.testActivityId
    )
    answerIds.forEach((id) => {
      if (questionIds.includes(id)) {
        userResponse[id] = allAnswers[id]
      }
    })

    const validResponses = values(userResponse).filter((item) => !!item)
    // if user response is empty show toaster msg.
    if (isEmpty(validResponses)) {
      yield put({ type: SET_CHECK_ANSWER_PROGRESS_STATUS, payload: false })
      return notification({
        type: 'warn',
        messageKey: 'attemptTheQuestonToCheckAnswer',
      })
    }
    const { items, currentItem } = yield select((state) => state.test)
    const testItemId = items[currentItem]._id
    const shuffledOptions = yield select((state) => state.shuffledOptions)
    const questions = getQuestionIds(items[currentItem])
    const shuffles = {}
    questions.forEach((question) => {
      if (shuffledOptions[question]) {
        shuffles[question] = shuffledOptions[question]
      }
    })
    const _userWork = yield select(
      ({ userWork }) => userWork.present[testItemId]
    )
    const activity = {
      answers: userResponse,
      groupId,
      testActivityId,
      // TODO Need to pick as per the bookmark button status
      reviewLater: false,
      shuffledOptions: shuffles,
      // TODO timeSpent:{}
    }
    let userWorkData = { ..._userWork, scratchpad: false }
    if (_userWork) {
      const scratchPadUsed = !isEmpty(_userWork?.scratchpad)
      if (scratchPadUsed) {
        const dimensions = yield select(scratchpadDomRectSelector)
        const userId = yield select((state) => state?.user?.user?._id)
        const { testActivityId: userTestActivityId, isDocBased } = yield select(
          (state) => state.test
        )
        if (scratchPadUsed) {
          const fileData = isDocBased
            ? {
                ..._userWork.scratchpad,
                name: `${userTestActivityId}_${userId}`,
              }
            : _userWork.scratchpad
          const scratchpadUri = yield call(
            uploadToS3,
            fileData,
            aws.s3Folders.DEFAULT
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
          userWorkData = { ...userWorkData, scratchpad: true, dimensions }
        }
      }
    }
    activity.userWork = userWorkData
    const { evaluations, maxScore, score } = yield call(
      testItemsApi.evaluation,
      testItemId,
      activity
    )
    const [type, message] = getTypeAndMsgBasedOnScore(score, maxScore)
    yield put({
      type: CHANGE_PREVIEW,
      payload: {
        view: 'check',
      },
    })
    yield put({
      type: CHANGE_VIEW,
      payload: {
        view: 'preview',
      },
    })

    yield put({
      type: ADD_ITEM_EVALUATION,
      payload: {
        ...evaluations,
      },
    })

    yield put({
      type: COUNT_CHECK_ANSWER,
      payload: {
        itemId: testItemId,
      },
    })
    yield put({ type: SET_CHECK_ANSWER_PROGRESS_STATUS, payload: false })
    notification({ type, msg: message })
  } catch (err) {
    if (err.status === 403)
      notification({
        type: 'warn',
        messageKey: 'checkAnswerLimitExceededForItem',
      })
    else notification({ messageKey: 'checkAnswerFail' })
    console.log(err)
    captureSentryException(err)
  }
}

export default function* watcherSaga() {
  yield all([yield takeEvery(CHECK_ANSWER_EVALUATION, evaluateAnswers)])
}
