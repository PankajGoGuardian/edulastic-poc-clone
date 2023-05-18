import {
  takeEvery,
  call,
  put,
  all,
  select,
  takeLatest,
} from 'redux-saga/effects'
import { createSelector } from 'reselect'
import { createAction, createReducer } from 'redux-starter-kit'
import { rubricsApi } from '@edulastic/api'
import { notification } from '@edulastic/common'
import { v4 } from 'uuid'
import { isEmpty } from 'lodash'
import { setRubricIdAction } from '../sharedDucks/questions'
import { setItemLevelScoreFromRubricAction } from '../ItemDetail/ducks'
import { getUserOrgId } from '../src/selectors/user'

// constants
export const UPDATE_RUBRIC_DATA = '[rubric] update rubric data'
export const SAVE_RUBRIC = '[rubric] save rubric'
export const UPDATE_RUBRIC = '[rubric] update rubric'
export const SEARCH_RUBRICS = '[rubric] search rubrics request'
export const SEARCH_RUBRICS_SUCCESS = '[rubric] search rubric success'
export const SEARCH_RUBRICS_FAILED = '[rubric] search rubric failed'
export const DELETE_RUBRIC_REQUEST = '[rubric] delete rubric request'
export const GET_RUBRIC_BY_ID_REQUEST = '[rubric] get rubric by id request'
export const GET_RUBRIC_BY_ID_SUCCESS = '[rubric] get rubric by id success'
export const ADD_RUBRIC_TO_RECENTLY_USED =
  '[rubric] add rubric to recently used'
export const UPDATE_RUBRIC_IN_RECENTLY_USED_LIST =
  '[rubric] update rubric in recently used list'
export const SET_RECENTLY_USED_LIST = '[rubric] set recently used list'
export const SET_RUBRIC_DATA_LOADING = '[rubric] set rubric data loading'
export const GENERATE_RUBRIC = '[rubric] generate rubric'
export const SET_IS_RUBRIC_GENERATION_IN_PROGRESS =
  '[rubric] set is rubric generation in progress'
export const SET_RUBRIC_GENERATION_STIMULUS_METADATA =
  '[rubric] set rubric generation stimulus metadata'

export const INCREMENT_RUBRIC_GENERATION_COUNT =
  '[rubric] increment rubric generation count'
export const SET_REMOVE_AI_TAG = '[rubric] set rubric data loading'
export const SET_UUID_LIST = '[rubric] set uuids'
// actions
export const updateRubricDataAction = createAction(UPDATE_RUBRIC_DATA)
export const saveRubricAction = createAction(SAVE_RUBRIC)
export const updateRubricAction = createAction(UPDATE_RUBRIC)
export const searchRubricsRequestAction = createAction(SEARCH_RUBRICS)
export const searchRubricsSuccessAction = createAction(SEARCH_RUBRICS_SUCCESS)
export const searchRubricsFailedAction = createAction(SEARCH_RUBRICS_FAILED)
export const deleteRubricAction = createAction(DELETE_RUBRIC_REQUEST)
export const getRubricByIdRequestAction = createAction(GET_RUBRIC_BY_ID_REQUEST)
export const getRubricByIdSuccessAction = createAction(GET_RUBRIC_BY_ID_SUCCESS)
export const addRubricToRecentlyUsedAction = createAction(
  ADD_RUBRIC_TO_RECENTLY_USED
)
export const updateRubricInRecentlyUsedAction = createAction(
  UPDATE_RUBRIC_IN_RECENTLY_USED_LIST
)
export const setRecentlyUsedList = createAction(SET_RECENTLY_USED_LIST)
export const setRubricDataLoadingAction = createAction(SET_RUBRIC_DATA_LOADING)
export const autoGenerateRubricAction = createAction(GENERATE_RUBRIC)
export const setIsRubricGenerationInProgress = createAction(
  SET_IS_RUBRIC_GENERATION_IN_PROGRESS
)
export const setRubricGenerationStimulusMetaDataAction = createAction(
  SET_RUBRIC_GENERATION_STIMULUS_METADATA
)

export const incrementRubricGenerationCountAction = createAction(
  INCREMENT_RUBRIC_GENERATION_COUNT
)
export const setRemoveAiTagAction = createAction(SET_REMOVE_AI_TAG)
export const setUUIDsAction = createAction(SET_UUID_LIST)

// selectors
export const getStateSelector = (state) => state.rubricReducer

export const getCurrentRubricDataSelector = createSelector(
  getStateSelector,
  (state) => state.currentRubric
)

export const getSearchedRubricsListSelector = createSelector(
  getStateSelector,
  (state) => state.searchedList
)

export const getSearchingStateSelector = createSelector(
  getStateSelector,
  (state) => state.searchingRubrics
)

export const getTotalSearchedCountSelector = createSelector(
  getStateSelector,
  (state) => state.totalSearchedCount
)

export const getRecentlyUsedRubricsSelector = createSelector(
  getStateSelector,
  getUserOrgId,
  (state, userDistrictId) => {
    const localStoredRubrics = localStorage.getItem(
      `recentlyUsedRubrics_${userDistrictId}`
    )
    try {
      if (!localStoredRubrics) {
        return []
      }
      const rubrics = JSON.parse(localStoredRubrics)
      return rubrics.filter((rubric) => rubric.status !== 'archived')
    } catch (error) {
      return []
    }
  }
)

export const getRubricDataLoadingSelector = createSelector(
  getStateSelector,
  (state) => state.rubricDataLoading
)

export const getRubricGenerationInProgress = createSelector(
  getStateSelector,
  (state) => state.rubricGenerationInProgress
)

export const getPreviousStimulus = createSelector(
  getStateSelector,
  (state) => state.rubricGenerationStimulusMetadata.stimulus
)

export const getRubricGenerationCountForGivenStimulus = createSelector(
  getStateSelector,
  (state) =>
    state.rubricGenerationStimulusMetadata.rubricGenerationCountForGivenStimulus
)

export const getRubricUUIDsSelector = createSelector(
  getStateSelector,
  (state) => state.uuids
)

// reducer
const initialState = {
  searchedList: [],
  currentRubric: null,
  searchingRubrics: false,
  totalSearchedCount: 0,
  rubricDataLoading: false,
  rubricGenerationInProgress: false,
  rubricGenerationStimulusMetadata: {
    stimulus: '',
    rubricGenerationCountForGivenStimulus: 0,
  },
  removeAiTag: false,
}

export const reducer = createReducer(initialState, {
  [UPDATE_RUBRIC_DATA]: (state, { payload }) => {
    state.currentRubric = payload
  },
  [SEARCH_RUBRICS]: (state) => {
    state.searchingRubrics = true
  },
  [SEARCH_RUBRICS_SUCCESS]: (state, { payload }) => {
    state.searchingRubrics = false
    state.searchedList = (payload.rubrics || []).filter(
      (rubric) => rubric.status !== 'archived'
    )
    state.totalSearchedCount = payload.total
  },
  [SEARCH_RUBRICS_FAILED]: (state) => {
    state.searchingRubrics = false
  },
  [SET_IS_RUBRIC_GENERATION_IN_PROGRESS]: (state, { payload }) => {
    state.rubricGenerationInProgress = payload
  },
  [GET_RUBRIC_BY_ID_SUCCESS]: (state, { payload }) => {
    state.rubricDataLoading = false
    state.currentRubric = payload[0]
  },
  [SET_RECENTLY_USED_LIST]: (state, { payload }) => {
    state.recentlyUsedRubrics = payload
  },
  [SET_RUBRIC_DATA_LOADING]: (state, { payload }) => {
    state.rubricDataLoading = payload
  },
  [SET_RUBRIC_GENERATION_STIMULUS_METADATA]: (state, { payload }) => {
    state.rubricGenerationStimulusMetadata = payload
  },
  [INCREMENT_RUBRIC_GENERATION_COUNT]: (state) => {
    state.rubricGenerationStimulusMetadata.rubricGenerationCountForGivenStimulus += 1
  },
  [SET_REMOVE_AI_TAG]: (state, { payload }) => {
    state.removeAiTag = payload
  },
  [SET_UUID_LIST]: (state, { payload }) => {
    state.uuids = payload
  },
})

// sagas
function* saveRubricSaga({ payload }) {
  try {
    const data = yield call(rubricsApi.createRubrics, payload.rubricData)
    yield put(updateRubricDataAction(data))
    yield put(
      setRubricIdAction({
        metadata: { _id: data._id, name: data.name },
        maxScore: payload.maxScore,
      })
    )
    yield put(addRubricToRecentlyUsedAction(data))
    yield put(setItemLevelScoreFromRubricAction(false))
    if (payload.rubricData.status === 'draft')
      notification({ type: 'success', messageKey: 'rubricIsSavedAsDraft' })
    else if (payload.rubricData.status === 'published')
      notification({
        type: 'success',
        messageKey: 'rubricIsSavedAndSpublished',
      })
  } catch (err) {
    notification({ messageKey: 'failedToSaveRubric' })
  }
}

function* updateRubricSaga({ payload }) {
  try {
    const data = yield call(rubricsApi.updateRubricsById, {
      id: payload.rubricData._id,
      body: payload.rubricData,
    })
    yield put(updateRubricDataAction(data))
    if (payload.changes !== 'SHARED_TYPE') {
      yield put(
        setRubricIdAction({
          metadata: { _id: data._id, name: data.name },
          maxScore: payload.maxScore,
        })
      )
    }
    yield put(addRubricToRecentlyUsedAction(payload.rubricData))
    yield put(updateRubricInRecentlyUsedAction(data))
    if (payload.status === 'draft')
      notification({ type: 'success', messageKey: 'rubricUpdatedAsDraft' })
    else if (payload.status === 'published')
      notification({
        type: 'success',
        messageKey: 'rubricUpdatedAndSPublished',
      })
    else if (payload.changes === 'SHARED_TYPE') {
      // to use custom message for specific changes
      notification({
        type: 'success',
        messageKey: 'rubricSharedSuccessfully',
      })
    }
  } catch (err) {
    notification({ messageKey: 'failedToUpdateRubric' })
  }
}

function* searchRubricsSaga({ payload }) {
  try {
    const data = yield call(rubricsApi.getSerchedRubrics, payload)
    yield put(searchRubricsSuccessAction(data))
  } catch (err) {
    yield put(searchRubricsFailedAction(''))
    notification({ messageKey: 'UnableToreachRubric' })
  }
}

function* deleteRubricSaga({ payload }) {
  try {
    yield call(rubricsApi.deleteRuricsById, payload)
    notification({ type: 'success', messageKey: 'rubricDeletedSuccessfully' })
  } catch (err) {
    console.error(err)
    notification({ messageKey: 'failedToDeleteTheRubric' })
  }
}

function* getRubricByIdSaga({ payload }) {
  try {
    yield put(setRubricDataLoadingAction(true))
    const rubric = yield call(rubricsApi.getRubricsById, payload)
    yield put(getRubricByIdSuccessAction(rubric))
  } catch (err) {
    console.error(err)
    notification({ messageKey: 'failedToFetchRubric' })
  } finally {
    yield put(setRubricDataLoadingAction(false))
  }
}

function* addRubricToRecentlyUsedSaga({ payload }) {
  const userDistrictId = yield select(getUserOrgId)
  let localStoredRubrics = localStorage.getItem(
    `recentlyUsedRubrics_${userDistrictId}`
  )
  if (localStoredRubrics) {
    localStoredRubrics = JSON.parse(localStoredRubrics)
    const isAlreadyPresent = localStoredRubrics.find(
      (r) => r._id === payload._id
    )
    if (!isAlreadyPresent) localStoredRubrics = [...localStoredRubrics, payload]
  } else {
    localStoredRubrics = [payload]
  }
  localStorage.setItem(
    `recentlyUsedRubrics_${userDistrictId}`,
    JSON.stringify(localStoredRubrics)
  )
  yield put(setRecentlyUsedList(localStoredRubrics))
}

function* updateRubricInRecentlyUsedSaga({ payload }) {
  const userDistrictId = yield select(getUserOrgId)
  let localStoredRubrics = localStorage.getItem(
    `recentlyUsedRubrics_${userDistrictId}`
  )
  if (localStoredRubrics) {
    localStoredRubrics = JSON.parse(localStoredRubrics)
    let updatedList = localStoredRubrics.filter((r) => r._id !== payload._id)
    if (updatedList.length < localStoredRubrics.length) {
      updatedList = [...updatedList, payload]
      localStorage.setItem(
        `recentlyUsedRubrics_${userDistrictId}`,
        JSON.stringify(updatedList)
      )
      yield put(setRecentlyUsedList(updatedList))
    }
  }
}

function* generateRubricSaga({ payload }) {
  try {
    yield put(setIsRubricGenerationInProgress(true))
    const data = yield call(rubricsApi.generateRubrics, payload)
    const generatedCriterias = JSON.parse(data)
    const uuids = []
    const getUUID = () => {
      const uuid = v4()
      uuids.push(uuid)
      return uuid
    }
    if (!isEmpty(generatedCriterias)) {
      const generatedCriteriasWithId = generatedCriterias.map(
        ({ performance_criteria_name, ratings }) => ({
          name: performance_criteria_name,
          id: getUUID(),
          ratings: ratings.map(
            ({ rating_name, rating_description, rating_points }) => ({
              name: rating_name,
              desc: rating_description,
              points: rating_points,
              id: getUUID(),
            })
          ),
        })
      )
      const existingRubricData = yield select(getCurrentRubricDataSelector)
      let newRubricData = {}
      if (!isEmpty(existingRubricData)) {
        newRubricData = {
          ...existingRubricData,
          criteria: [
            ...existingRubricData.criteria,
            ...generatedCriteriasWithId,
          ],
        }
      } else {
        newRubricData = {
          name: '',
          description: '',
          criteria: generatedCriteriasWithId,
        }
      }
      yield put(setUUIDsAction(uuids))
      yield put(updateRubricDataAction(newRubricData))
      notification({
        type: 'success',
        messageKey: 'rubricGeneratedSuccessfully',
      })
    } else {
      notification({ messageKey: 'failedToGenerateRubric' })
    }
    yield put(setIsRubricGenerationInProgress(false))
    yield put(incrementRubricGenerationCountAction())
  } catch (err) {
    notification({ messageKey: 'failedToGenerateRubric' })
    yield put(setIsRubricGenerationInProgress(false))
    yield put(incrementRubricGenerationCountAction())
  }
}

export function* watcherSaga() {
  yield all([
    yield takeEvery(SAVE_RUBRIC, saveRubricSaga),
    yield takeEvery(UPDATE_RUBRIC, updateRubricSaga),
    yield takeEvery(SEARCH_RUBRICS, searchRubricsSaga),
    yield takeEvery(DELETE_RUBRIC_REQUEST, deleteRubricSaga),
    yield takeEvery(GET_RUBRIC_BY_ID_REQUEST, getRubricByIdSaga),
    yield takeEvery(ADD_RUBRIC_TO_RECENTLY_USED, addRubricToRecentlyUsedSaga),
    yield takeEvery(
      UPDATE_RUBRIC_IN_RECENTLY_USED_LIST,
      updateRubricInRecentlyUsedSaga
    ),
    yield takeLatest(GENERATE_RUBRIC, generateRubricSaga),
  ])
}
