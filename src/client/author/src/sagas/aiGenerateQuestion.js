import { testItemsApi } from '@edulastic/api'
import { notification } from '@edulastic/common'
import { all, call, put, takeEvery } from 'redux-saga/effects'
import { setAIGeneratedQuestionStateAction } from '../actions/aiGenerateQuestion'
import { FETCH_AI_GENERATE_QUESTION } from '../constants/actions'

function* bulkUpdateAssignmentSettingsSaga({ payload }) {
  try {
    yield put(
      setAIGeneratedQuestionStateAction({ apiStatus: 'INITIATED', result: [] })
    )
    // const { result } = {
    //   result: [
    //     {
    //       name: 'What can you make on Adapted Mind?',
    //       displayAtSecond: 4,
    //       correctAnswerIndex: 0,
    //       options: [
    //         {
    //           name: 'Cool pets',
    //         },
    //         {
    //           name: 'Delicious food',
    //         },
    //         {
    //           name: 'Awesome toys',
    //         },
    //         {
    //           name: 'Funny jokes',
    //         },
    //       ],
    //     },
    //   ],
    // }
    const { result } = yield call(testItemsApi.generateQuestionViaAI, payload)
    yield put(
      setAIGeneratedQuestionStateAction({ apiStatus: 'SUCCESS', result })
    )
  } catch (err) {
    yield put(
      setAIGeneratedQuestionStateAction({ apiStatus: 'FAILED', result: [] })
    )
    const errorMessage =
      err.response.data?.message || 'Failed to generate AI question.'
    notification({ msg: errorMessage })
  }
}

export default function* watcherSaga() {
  yield all([
    yield takeEvery(
      FETCH_AI_GENERATE_QUESTION,
      bulkUpdateAssignmentSettingsSaga
    ),
  ])
}
