import { createAction, createReducer } from 'redux-starter-kit'
import { takeEvery, call, put, all, select } from 'redux-saga/effects'
import { notification } from '@edulastic/common'
import { testActivityApi, attchmentApi as attachmentApi } from '@edulastic/api'
import { aws } from '@edulastic/constants'
import { createSelector } from 'reselect'
import { gradebookTestItemAddAction } from '../src/reducers/testActivity'
import { SAVE_USER_WORK } from '../../assessment/constants/actions'
import { updateScratchpadAction } from '../../common/components/Scratchpad/duck'
import {
  getFilterAndUpdateForAttachments,
  getFileNameAndQidMap,
} from '../../assessment/sagas/items'

const defaultUploadFolder = aws.s3Folders.DEFAULT

export const SUBMIT_RESPONSE = '[expressGraderAnswers] submit'

// Score
export const SET_TEACHER_EDITED_SCORE = '[score] set teacher edited score'
export const REMOVE_TEACHER_EDITED_SCORE = '[score] remove teacher edited score'
export const GET_TEACHER_EDITED_SCORE = '[score] get teacher edited score'

export const REQUEST_SCRATCH_PAD_REQUEST = '[scratchpad] load request'
export const REQUEST_SCRATCH_PAD_SUCCESS = '[scratchpad] load success'
export const REQUEST_SCRATCH_PAD_ERROR = '[scratchpad] load error'
export const TOGGLE_SCORE_MODE = '[expressgrader] toggle score/response'
export const DISABLE_SCORE_MODE = '[expressgrader] enable score mode'
export const SUBMIT_RESPONSE_COMPLETED = '[expressgrade] completed submitting'
export const SET_UPDATED_SCRATCHPAD = '[expressgrader] set updated scratchpad'
export const UPLOAD_DATA_AND_UPDATE_ATTACHMENT =
  '[expressgrader] upload data and update attachment'

// -----|-----|-----|-----| ACTIONS BEGIN |-----|-----|-----|----- //

export const submitResponseAction = createAction(SUBMIT_RESPONSE)
export const setTeacherEditedScore = createAction(SET_TEACHER_EDITED_SCORE)
export const removeTeacherEditedScoreAction = createAction(
  REMOVE_TEACHER_EDITED_SCORE
)
export const requestScratchPadAction = createAction(REQUEST_SCRATCH_PAD_REQUEST)
export const scratchPadLoadSuccessAction = createAction(
  REQUEST_SCRATCH_PAD_SUCCESS
)
export const scratchPadLoadErrorAction = createAction(REQUEST_SCRATCH_PAD_ERROR)
export const toggleScoreModeAction = createAction(TOGGLE_SCORE_MODE)
export const disableScoreModeAction = createAction(DISABLE_SCORE_MODE)
export const submitResponseCompletedAction = createAction(
  SUBMIT_RESPONSE_COMPLETED
)
export const setUpdatedScratchPadAction = createAction(SET_UPDATED_SCRATCHPAD)
export const uploadDataAndUpdateAttachmentAction = createAction(
  UPLOAD_DATA_AND_UPDATE_ATTACHMENT
)

// -----|-----|-----|-----| ACTIONS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SELECTORS BEGIN |-----|-----|-----|----- //

export const stateSelector = (state) => state.expressGraderReducer

export const getTeacherEditedScoreSelector = createSelector(
  stateSelector,
  (state) => state.teacherEditedScore
)

export const getScratchpadLoadingSelector = createSelector(
  stateSelector,
  (state) => state.scratchPadLoading
)

export const getIsScoringCompletedSelector = createSelector(
  stateSelector,
  (state) => state.isScoring
)

export const getUpdatedScratchPadSelector = createSelector(
  stateSelector,
  (state) => state.updatedScratchPad
)

// -----|-----|-----|-----| SELECTORS ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| REDUCER BEGIN |-----|-----|-----|----- //

const initialState = {
  teacherEditedScore: {},
  scratchPadLoading: false,
  scoreMode: true,
  isScoring: false,
  updatedScratchPad: false,
}

export const expressGraderReducer = createReducer(initialState, {
  [SET_TEACHER_EDITED_SCORE]: (state, { payload }) => {
    state.teacherEditedScore = payload
  },
  [REMOVE_TEACHER_EDITED_SCORE]: (state) => {
    state.teacherEditedScore = {}
  },
  [REQUEST_SCRATCH_PAD_REQUEST]: (state) => {
    state.scratchPadLoading = true
  },
  [REQUEST_SCRATCH_PAD_SUCCESS]: (state) => {
    state.scratchPadLoading = false
  },
  [REQUEST_SCRATCH_PAD_ERROR]: (state) => {
    state.scratchPadLoading = false
  },
  [TOGGLE_SCORE_MODE]: (state) => {
    state.scoreMode = !state.scoreMode
  },
  [DISABLE_SCORE_MODE]: (state) => {
    state.scoreMode = false
  },
  [SUBMIT_RESPONSE]: (state) => {
    state.isScoring = true
  },
  [SUBMIT_RESPONSE_COMPLETED]: (state) => {
    state.isScoring = false
  },
  [SET_UPDATED_SCRATCHPAD]: (state, { payload }) => {
    state.updatedScratchPad = payload
  },
})

// -----|-----|-----|-----| REDUCER ENDED |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| SAGAS BEGIN |-----|-----|-----|----- //

function* submitResponse({ payload }) {
  const {
    testActivityId,
    itemId,
    groupId,
    userResponse,
    scratchPadData,
  } = payload
  try {
    yield put(removeTeacherEditedScoreAction())
    const scoreRes = yield call(testActivityApi.updateResponseEntryAndScore, {
      testActivityId,
      itemId,
      groupId,
      userResponse,
      scratchPadData,
    })
    notification({
      type: 'success',
      messageKey: 'updatedResponseSuccessfully',
    })
    const { questionActivities } = scoreRes
    yield put(
      gradebookTestItemAddAction(
        questionActivities.map(({ qid: _id, maxScore, ...question }) => ({
          maxScore,
          ...question,
          _id,
        }))
      )
    )
  } catch (e) {
    console.error(e)
    notification({ messageKey: 'editResponseFailed' })
  } finally {
    yield put(submitResponseCompletedAction())
  }
}

function* scratchPadLoadSaga({ payload }) {
  try {
    const {
      testActivityId,
      testItemId,
      qActId,
      callback,
      isVideoQuiz = false,
    } = payload
    const userWork = yield select((state) => state.userWork.present)
    // Need to show show student work button always for video quiz and need not call API to fetch attachments
    if (!isVideoQuiz && !userWork[qActId] && testActivityId && testItemId) {
      yield put(updateScratchpadAction({ loading: true }))
      const { attachments = [] } = yield call(
        attachmentApi.loadAllAttachments,
        {
          referrerId: testActivityId,
          referrerId2: testItemId,
        }
      )
      const scratchpadData = {}
      for (const attachment of attachments) {
        const { data } = attachment
        scratchpadData[qActId] = data.scratchpad
        if (
          attachment.type === 'doc-annotations' &&
          !userWork[testActivityId]
        ) {
          // fetch the doc annotation for the doc based assignments if not already present.
          const response = yield call(
            attachmentApi.loadDataFromUrl,
            data.freeNotesStd
          )
          scratchpadData[testActivityId] = { freeNotesStd: response.data }
        }
      }
      yield put({ type: SAVE_USER_WORK, payload: scratchpadData })
      yield put(updateScratchpadAction({ loading: false }))
    }

    if (callback) {
      yield call(callback)
    }
  } catch (e) {
    console.error(e)
    notification({ messageKey: 'loadingScratchFailed' })
    yield put(scratchPadLoadErrorAction())
  }
}

function* uploadDataAndUpdateAttachmentSaga({ payload }) {
  try {
    const { userWork = {}, uta, itemId, userId } = payload || {}

    const listOfFilenameAndQuestionIdDict = yield all(
      Object.entries(userWork).map(([qid, scratchpadData]) =>
        call(getFileNameAndQidMap, qid, scratchpadData, defaultUploadFolder)
      )
    )

    yield all(
      (listOfFilenameAndQuestionIdDict || []).map(({ qId, fileName }) => {
        const { update, filter } = getFilterAndUpdateForAttachments({
          uta,
          itemId,
          userId,
          qId,
          scratchpadUri: fileName,
        })
        return call(attachmentApi.updateAttachment, { update, filter })
      })
    )
  } catch (e) {
    console.error(e)
  }
}

export function* watcherSaga() {
  yield all([
    yield takeEvery(SUBMIT_RESPONSE, submitResponse),
    yield takeEvery(REQUEST_SCRATCH_PAD_REQUEST, scratchPadLoadSaga),
    yield takeEvery(
      UPLOAD_DATA_AND_UPDATE_ATTACHMENT,
      uploadDataAndUpdateAttachmentSaga
    ),
  ])
}

// -----|-----|-----|-----| SAGAS ENDED |-----|-----|-----|----- //
