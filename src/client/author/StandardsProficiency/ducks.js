import { takeEvery, call, put, all, select } from 'redux-saga/effects'
import { settingsApi } from '@edulastic/api'
import { notification } from '@edulastic/common'
import { createAction, createReducer } from 'redux-starter-kit'
import { getUserOrgId } from '../src/selectors/user'

const RECEIVE_STANDARDS_PROFICIENCY_REQUEST =
  '[Standards Proficiency] receive data request'
const RECEIVE_STANDARDS_PROFICIENCY_SUCCESS =
  '[Standards Proficiency] receive data success'
const RECEIVE_STANDARDS_PROFICIENCY_ERROR =
  '[Standards Proficiency] receive data error'
const UPDATE_STANDARDS_PROFICIENCY_REQUEST =
  '[Standards Proficiency] update data request'
const UPDATE_STANDARDS_PROFICIENCY_SUCCESS =
  '[Standards Proficiency] update data success'
const UPDATE_STANDARDS_PROFICIENCY_ERROR =
  '[Standards Proficiency] update data error'
const CREATE_STANDARDS_PROFICIENCY_REQUEST =
  '[Standards Proficiency] create data request'
const CREATE_STANDARDS_PROFICIENCY_SUCCESS =
  '[Standards Proficiency] create data success'
const CREATE_STANDARDS_PROFICIENCY_ERROR =
  '[Standards Proficiency] create data error'

const SET_STANDARDS_SCALE_DATA = '[Standards Proficiency] set scale data'
const SET_STANDARDS_PROFILE_NAME = '[Standards Proficiency] set profile name'
const SET_STANDARDS_CALCTYPE = '[Standards Proficiency] set calctype'
const SET_STANDARDS_DECAYINGATTR =
  '[Standards Proficiency] set decaying attribute value'
const SET_STANDARDS_MOVINGAVRATTR =
  '[Standards Proficiency] set moving average value value'
const DELETE_STANDARDS_PROFICIENCY = '[Standards Proficiency] delete'
const DELETE_STANDARDS_PROFICIENCY_ERROR =
  '[Standards Proficiency] delete error'
const SET_EDITING_INDEX = '[Standards Proficiency] set editing index'
const SET_EDITABLE = '[Standards Proficiency] set editable'
const SET_CONFLICT = '[Standards Proficiency] set conflict'

export const receiveStandardsProficiencyAction = createAction(
  RECEIVE_STANDARDS_PROFICIENCY_REQUEST
)
export const receiveStandardsProficiencySuccessAction = createAction(
  RECEIVE_STANDARDS_PROFICIENCY_SUCCESS
)
export const receiveStandardsProficiencyErrorAction = createAction(
  RECEIVE_STANDARDS_PROFICIENCY_ERROR
)
export const updateStandardsProficiencyAction = createAction(
  UPDATE_STANDARDS_PROFICIENCY_REQUEST
)
export const updateStandardsProficiencySuccessAction = createAction(
  UPDATE_STANDARDS_PROFICIENCY_SUCCESS
)
export const updateStandardsProficiencyErrorAction = createAction(
  UPDATE_STANDARDS_PROFICIENCY_ERROR
)
export const createStandardsProficiencyAction = createAction(
  CREATE_STANDARDS_PROFICIENCY_REQUEST
)
export const createStandardsProficiencySuccessAction = createAction(
  CREATE_STANDARDS_PROFICIENCY_SUCCESS
)
export const createStandardsProficiencyErrorAction = createAction(
  CREATE_STANDARDS_PROFICIENCY_ERROR
)

export const setStandardsProficiencyProfileNameAction = createAction(
  SET_STANDARDS_PROFILE_NAME
)

export const setEditingIndexAction = createAction(SET_EDITING_INDEX)
export const setEDitableAction = createAction(SET_EDITABLE)
export const setConflitAction = createAction(SET_CONFLICT)

export const deleteStandardsProficiencyAction = createAction(
  DELETE_STANDARDS_PROFICIENCY
)
export const deleteStandardsProficiencyErrorAction = createAction(
  DELETE_STANDARDS_PROFICIENCY_ERROR
)

export const setScaleDataAction = createAction(SET_STANDARDS_SCALE_DATA)
export const setCalcTypeAction = createAction(SET_STANDARDS_CALCTYPE)
export const setDecayingAttrValueAction = createAction(
  SET_STANDARDS_DECAYINGATTR
)
export const setMovingAttrValueAction = createAction(
  SET_STANDARDS_MOVINGAVRATTR
)

// reducers
const initialState = {
  data: [],
  error: null,
  loading: false,
  updating: false,
  updateError: null,
  creating: false,
  createError: null,
  editingIndex: undefined,
  editable: false,
}

export const reducer = createReducer(initialState, {
  [RECEIVE_STANDARDS_PROFICIENCY_REQUEST]: (state) => {
    state.loading = true
  },
  [RECEIVE_STANDARDS_PROFICIENCY_SUCCESS]: (state, { payload }) => {
    state.loading = false
    state.data = []
    for (const el of payload) {
      if (el != null) {
        const { scale, calcType, ...rest } = el
        const scaleData = []
        for (let i = 0; i < scale.length; i++) {
          scaleData.push({
            key: i,
            score: scale[i].score,
            _id: scale[i]._id,
            shortName: scale[i].shortName,
            threshold: scale[i].threshold,
            masteryLevel: scale[i].masteryLevel,
            color: scale[i].color,
            domainMastery: scale[i].domainMastery,
          })
        }
        state.data.push({
          ...rest,
          _id: el._id,
          name: el.name,
          calcType,
          scale: scaleData,
        })
      } else {
        state.data.push({
          _id: '',
          name: 'Standard Proficiency',
          calcType: 'DECAYING_AVERAGE',
          calcDecayingAttr: 60,
          decay: 60,
          calcMovingAvrAttr: 5,
          scale: [
            {
              key: 0,
              color: '#3DB04E',
              score: 4,
              masteryLevel: 'Exceeds Mastery',
              shortName: 'E',
              threshold: 90,
              domainMastery: true,
            },
            {
              key: 1,
              color: '#74E27A',
              score: 3,
              masteryLevel: 'Mastered',
              shortName: 'M',
              threshold: 80,
              domainMastery: true,
            },
            {
              key: 2,
              color: '#EBDD54',
              score: 2,
              masteryLevel: 'Almost Mastered',
              shortName: 'A',
              threshold: 60,
              domainMastery: false,
            },
            {
              key: 3,
              color: '#FEC571',
              score: 1,
              masteryLevel: 'Not Mastered',
              shortName: 'N',
              threshold: 0,
              domainMastery: false,
            },
          ],
        })
      }
    }
  },
  [RECEIVE_STANDARDS_PROFICIENCY_ERROR]: (state, { payload }) => {
    state.loading = false
    state.error = payload.error
  },
  [UPDATE_STANDARDS_PROFICIENCY_REQUEST]: (state) => {
    state.updating = true
  },
  [UPDATE_STANDARDS_PROFICIENCY_SUCCESS]: (state) => {
    state.updating = false
  },
  [UPDATE_STANDARDS_PROFICIENCY_ERROR]: (state, { payload }) => {
    state.updating = false
    state.updateError = payload.error
  },
  [CREATE_STANDARDS_PROFICIENCY_REQUEST]: (state) => {
    state.creating = true
  },
  [CREATE_STANDARDS_PROFICIENCY_SUCCESS]: (state) => {
    state.creating = false
  },
  [CREATE_STANDARDS_PROFICIENCY_ERROR]: (state, { payload }) => {
    state.creating = false
    state.createError = payload.error
  },
  [SET_STANDARDS_SCALE_DATA]: (state, { payload }) => {
    const { _id, data } = payload
    state.data.find((x) => x._id === _id).scale = data
  },
  [SET_STANDARDS_CALCTYPE]: (state, { payload }) => {
    const { _id, data } = payload
    state.data.find((x) => x._id === _id).calcType = data
  },
  [SET_STANDARDS_PROFILE_NAME]: (state, { payload }) => {
    const { _id, name } = payload
    state.data.find((x) => x._id === _id).name = name
  },
  [SET_STANDARDS_DECAYINGATTR]: (state, { payload }) => {
    const { _id, data } = payload
    state.data.find((x) => x._id === _id).calcDecayingAttr = data
  },
  [SET_STANDARDS_MOVINGAVRATTR]: (state, { payload }) => {
    const { _id, data } = payload
    state.data.find((x) => x._id === _id).calcMovingAvrAttr = data
  },
  [SET_EDITING_INDEX]: (state, { payload }) => {
    state.editingIndex = state.editingIndex === payload ? undefined : payload
    state.editable = false
  },
  [SET_EDITABLE]: (state, { payload }) => {
    const { value, index } = payload
    state.editingIndex = index
    state.editable = value
  },
  [DELETE_STANDARDS_PROFICIENCY_ERROR]: (state, { payload }) => {
    state.error = payload
    state.conflict = true
  },
  [SET_CONFLICT]: (state, { payload }) => {
    state.conflict = payload
  },
})

// sagas
function* receiveStandardsProficiencySaga({ payload }) {
  const defaultOrgId = yield select(getUserOrgId)
  payload = payload || { orgId: defaultOrgId }
  try {
    const standardsProficiency = yield call(
      settingsApi.getStandardsProficiency,
      payload
    )
    standardsProficiency.sort((el1, el2) => (el1._id > el2._id ? -1 : 1))
    yield put(receiveStandardsProficiencySuccessAction(standardsProficiency))
  } catch (err) {
    const errorMessage =
      'Unable to retrieve standards proficiency for the user.'
    notification({ type: 'error', msg: errorMessage })
    yield put(receiveStandardsProficiencyErrorAction({ error: errorMessage }))
  }
}

function* updateStandardsProficiencySaga({ payload }) {
  try {
    const updateStandardsProficiency = yield call(
      settingsApi.updateStandardsProficiency,
      payload
    )
    yield put(
      updateStandardsProficiencySuccessAction(updateStandardsProficiency)
    )
  } catch (err) {
    const errorMessage = 'Unable to update standards proficiency for the user.'
    notification({ type: 'error', msg: errorMessage })
    yield put(updateStandardsProficiencyErrorAction({ error: errorMessage }))
  }
}

function* createStandardsProficiencySaga({ payload }) {
  const { index, ..._payload } = payload
  try {
    const createStandardsProficiency = yield call(
      settingsApi.createStandardsProficiency,
      _payload
    )
    yield put(
      createStandardsProficiencySuccessAction({
        ...createStandardsProficiency,
        index,
      })
    )
    yield put(receiveStandardsProficiencyAction())

    yield put(setEditingIndexAction(0))
  } catch (err) {
    console.error(err)
    const errorMessage = 'Unable to update standards proficiency for the user.'
    notification({ type: 'error', msg: errorMessage })
    yield put(updateStandardsProficiencyErrorAction({ error: errorMessage }))
  }
}

function* deleteStandardsProficiencySaga({ payload: _id }) {
  try {
    const districtId = yield select(getUserOrgId)
    yield call(settingsApi.deleteStandardsProficiency, _id, districtId)
    yield put(receiveStandardsProficiencyAction())
    notification({ type: 'success', messageKey: 'teacherUpdatedSuccessfully' })
  } catch (err) {
    if (err.status === 409) {
      yield put(
        deleteStandardsProficiencyErrorAction({ type: err.response.data['0'] })
      )
    } else {
      notification({ messageKey: 'deletingStandardsProficiencyFailed' })
    }
  }
}

export function* watcherSaga() {
  yield all([
    takeEvery(
      RECEIVE_STANDARDS_PROFICIENCY_REQUEST,
      receiveStandardsProficiencySaga
    ),
  ])
  yield all([
    takeEvery(
      UPDATE_STANDARDS_PROFICIENCY_REQUEST,
      updateStandardsProficiencySaga
    ),
  ])
  yield all([
    takeEvery(
      CREATE_STANDARDS_PROFICIENCY_REQUEST,
      createStandardsProficiencySaga
    ),
  ])
  yield all([
    takeEvery(DELETE_STANDARDS_PROFICIENCY, deleteStandardsProficiencySaga),
  ])
}
