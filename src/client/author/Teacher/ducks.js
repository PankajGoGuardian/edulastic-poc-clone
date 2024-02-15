import { createAction, createReducer } from 'redux-starter-kit'
import { createSelector } from 'reselect'
import { takeEvery, takeLatest, call, put, all } from 'redux-saga/effects'
import { userApi } from '@edulastic/api'
import { notification } from '@edulastic/common'

const RECEIVE_TEACHERLIST_REQUEST = '[teacher] receive list request'
export const RECEIVE_TEACHERLIST_SUCCESS = '[teacher] receive list success'
export const RECEIVE_TEACHERLIST_ERROR = '[teacher] receive list error'
const CREATE_TEACHER_REQUEST = '[teacher] create data request'
const CREATE_TEACHER_SUCCESS = '[teacher] create data success'
const CREATE_TEACHER_ERROR = '[teacher] create data error'
const UPDATE_TEACHER_REQUEST = '[teacher] update data request'
const UPDATE_TEACHER_SUCCESS = '[teacher] update data success'
const UPDATE_TEACHER_ERROR = '[teacher] update data error'
const DELETE_TEACHER_REQUEST = '[teacher] delete data request'
const DELETE_TEACHER_SUCCESS = '[teacher] delete data success'
const DELETE_TEACHER_ERROR = '[teacher] delete data error'

const SET_TEACHER_SEARCHNAME = '[teacher] set search name'
const SET_TEACHER_SETFILTERS = '[teacher] set filters'

export const receiveTeachersListAction = createAction(
  RECEIVE_TEACHERLIST_REQUEST
)
export const receiveTeachersListSuccessAction = createAction(
  RECEIVE_TEACHERLIST_SUCCESS
)
export const receiveTeachersListErrorAction = createAction(
  RECEIVE_TEACHERLIST_ERROR
)
export const createTeacherAction = createAction(CREATE_TEACHER_REQUEST)
export const createTeacherSuccessAction = createAction(CREATE_TEACHER_SUCCESS)
export const createTeacherErrorAction = createAction(CREATE_TEACHER_ERROR)
// never used
export const updateTeacherAction = createAction(UPDATE_TEACHER_REQUEST)
export const updateTeacherSuccessAction = createAction(UPDATE_TEACHER_SUCCESS)
export const updateTeacherErrorAction = createAction(UPDATE_TEACHER_ERROR)
export const deleteTeacherAction = createAction(DELETE_TEACHER_REQUEST)
export const deleteTeacherSuccessAction = createAction(DELETE_TEACHER_SUCCESS)
export const deleteTeacherErrorAction = createAction(DELETE_TEACHER_ERROR)

export const setSearchNameAction = createAction(SET_TEACHER_SEARCHNAME)
export const setFiltersAction = createAction(SET_TEACHER_SETFILTERS)

// selectors
const stateTeacherSelector = (state) => state.teacherReducer
export const getTeachersListSelector = createSelector(
  stateTeacherSelector,
  (state) => {
    if (state.data.length > 0) {
      let searchByNameData = []
      if (state.searchName.length > 0) {
        searchByNameData = state.data.filter((row) => {
          const name = `${row.firstName} ${row.lastName}`
          if (name === state.searchName) return row
        })
      } else {
        searchByNameData = state.data
      }

      let possibleFilterKey = []

      if (state.filtersColumn !== '') {
        possibleFilterKey.push(state.filtersColumn)
      } else {
        possibleFilterKey = ['firstName', 'lastName', 'email']
      }

      const filterSource = searchByNameData.filter((row) => {
        if (state.filtersText === '') {
          return row
        }
        if (state.filtersValue === 'eq') {
          const equalKeys = possibleFilterKey.filter((key) => {
            if (row[key] === state.filtersText) return row
          })
          if (equalKeys.length > 0) return row
        } else if (state.filtersValue === 'cont' || state.filtersValue === '') {
          const equalKeys = possibleFilterKey.filter((key) => {
            if (row[key] !== undefined) {
              if (row[key].toString().indexOf(state.filtersText) !== -1)
                return row
            }
          })
          if (equalKeys.length > 0) return row
        }
      })
      return filterSource
    }
    return state.data
  }
)

// reducers
const initialState = {
  data: [],
  loading: false,
  error: null,
  update: {},
  updating: false,
  updateError: null,
  create: { _id: -1 },
  creating: false,
  createError: null,
  delete: null,
  deleting: false,
  deleteError: null,
  searchName: '',
  filtersColumn: '',
  filtersValue: '',
  filtersText: '',
}

export const reducer = createReducer(initialState, {
  [RECEIVE_TEACHERLIST_REQUEST]: (state) => {
    state.loading = true
  },
  [RECEIVE_TEACHERLIST_SUCCESS]: (state, { payload }) => {
    const teachersList = []
    payload.map((row, index) => {
      let teacherData = {}
      teacherData = row
      teacherData.key = index
      if (row.hasOwnProperty('_source')) {
        const source = row._source
        Object.keys(source).map((key, value) => {
          teacherData[key] = source[key]
        })
      }
      delete teacherData._source
      teachersList.push(teacherData)
    })

    state.loading = false
    state.data = teachersList
  },
  [RECEIVE_TEACHERLIST_ERROR]: (state, { payload }) => {
    state.loading = false
    state.error = payload.error
  },
  [UPDATE_TEACHER_REQUEST]: (state) => {
    state.updating = true
  },
  [UPDATE_TEACHER_SUCCESS]: (state, { payload }) => {
    const teachersList = state.data.map((teacher) => {
      if (teacher._id === payload._id) {
        const newData = {
          ...payload,
        }
        return { ...teacher, ...newData }
      }
      return teacher
    })

    ;(state.update = payload),
      (state.updating = false),
      (state.data = teachersList)
  },
  [UPDATE_TEACHER_ERROR]: (state, { payload }) => {
    state.updating = false
    state.updateError = payload.error
  },
  [CREATE_TEACHER_REQUEST]: (state) => {
    state.creating = true
  },
  [CREATE_TEACHER_SUCCESS]: (state, { payload }) => {
    const createdTeacher = {
      key: state.data.length,
      _id: payload._id,
      firstName: payload.firstName,
      lastName: payload.lastName,
      role: payload.role,
      email: payload.email,
      institutionIds: payload.institutionIds,
    }

    state.creating = false
    state.create = createdTeacher
    state.data = [createdTeacher, ...state.data]
  },
  [CREATE_TEACHER_ERROR]: (state, { payload }) => {
    state.createError = payload.error
    state.creating = false
  },
  [DELETE_TEACHER_REQUEST]: (state) => {
    state.deleting = true
  },
  [DELETE_TEACHER_SUCCESS]: (state, { payload }) => {
    ;(state.delete = payload),
      (state.deleting = false),
      (state.data = state.data.filter((teacherData) => {
        let nMatchCount = 0
        payload.map((row) => {
          if (row.userId === teacherData._id) nMatchCount++
        })
        if (nMatchCount == 0) return teacherData
      }))
  },
  [DELETE_TEACHER_ERROR]: (state, { payload }) => {
    state.deleting = false
    state.deleteError = payload.error
  },
  [SET_TEACHER_SEARCHNAME]: (state, { payload }) => {
    state.searchName = payload
  },
  [SET_TEACHER_SETFILTERS]: (state, { payload }) => {
    state.filtersColumn = payload.column
    state.filtersValue = payload.value
    state.filtersText = payload.text
  },
})

// sagas
function* receiveTeachersListSaga({ payload }) {
  try {
    const { result: teachersList } = yield call(userApi.fetchUsers, payload)
    yield put(receiveTeachersListSuccessAction(teachersList))
  } catch (err) {
    const errorMessage = 'Unable to retrieve user info.'
    notification({ type: 'error', msg: errorMessage })
    yield put(receiveTeachersListErrorAction({ error: errorMessage }))
  }
}

function* updateTeacherSaga({ payload }) {
  try {
    const updateTeacherdData = yield call(userApi.updateUser, payload)
    notification({ type: 'success', messageKey: 'teacherUpdatedSuccessfully' })
    yield put(updateTeacherSuccessAction(updateTeacherdData))
  } catch (err) {
    const errorMessage = 'Unable to update user information.'
    notification({ type: 'error', msg: errorMessage })
    yield put(updateTeacherErrorAction({ error: errorMessage }))
  }
}

function* createTeacherSaga({ payload }) {
  try {
    const createTeacher = yield call(userApi.createUser, payload)
    yield put(createTeacherSuccessAction(createTeacher))
  } catch (err) {
    const errorMessage = 'Unable to create user.'
    notification({ type: 'error', msg: errorMessage })
    yield put(createTeacherErrorAction({ error: errorMessage }))
  }
}

function* deleteTeacherSaga({ payload }) {
  try {
    for (let i = 0; i < payload.length; i++) {
      yield call(userApi.deleteUser, payload[i])
    }
    notification({ messageKey: 'teacherRemovedSuccessfully' })

    yield put(deleteTeacherSuccessAction(payload))
  } catch (err) {
    const errorMessage = 'Unable to remove the user.'
    notification({ type: 'error', msg: errorMessage })
    yield put(deleteTeacherErrorAction({ deleteError: errorMessage }))
  }
}

export function* watcherSaga() {
  yield all([takeLatest(RECEIVE_TEACHERLIST_REQUEST, receiveTeachersListSaga)])
  yield all([takeEvery(UPDATE_TEACHER_REQUEST, updateTeacherSaga)])
  yield all([takeEvery(CREATE_TEACHER_REQUEST, createTeacherSaga)])
  yield all([takeEvery(DELETE_TEACHER_REQUEST, deleteTeacherSaga)])
}
