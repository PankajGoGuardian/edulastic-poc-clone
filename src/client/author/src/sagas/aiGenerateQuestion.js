import { testItemsApi } from '@edulastic/api'
import { notification } from '@edulastic/common'
import { all, call, put, takeEvery } from 'redux-saga/effects'
import { setAIGeneratedQuestionStateAction } from '../actions/aiGenerateQuestion'
import { FETCH_AI_GENERATE_QUESTION } from '../constants/actions'

function* fetchAIGeneratedQuestionSaga({ payload }) {
  const failedMessage =
    "Apologies for the inconvenience. We encountered an issue while generating questions based on the video's transcript. Please try again"
  try {
    notification({
      type: 'info',
      msg:
        "Generating personalized questions based on the video's content. This might take a moment, but we promise it'll be worth the wait!",
    })
    yield put(
      setAIGeneratedQuestionStateAction({ apiStatus: 'INITIATED', result: [] })
    )
    const { result } = yield call(testItemsApi.generateQuestionViaAI, payload)
    yield put(
      setAIGeneratedQuestionStateAction({ apiStatus: 'SUCCESS', result })
    )
    if (result?.length) {
      notification({
        type: 'success',
        msg: `Great news! We have successfully generated ${result.length} questions based on the video. We encourage you to review the questions and make any necessary adjustments to ensure they meet your learning objectives and preferences. Feel free to customize the questions further, if desired.`,
      })
    } else {
      notification({
        type: 'error',
        msg: failedMessage,
      })
    }
  } catch (err) {
    yield put(
      setAIGeneratedQuestionStateAction({ apiStatus: 'FAILED', result: [] })
    )
    const errorMessage = failedMessage
    notification({ msg: errorMessage })
  }
}

export default function* watcherSaga() {
  yield all([
    yield takeEvery(FETCH_AI_GENERATE_QUESTION, fetchAIGeneratedQuestionSaga),
  ])
}
