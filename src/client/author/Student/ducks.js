import { createAction, createReducer } from 'redux-starter-kit'
import { createSelector } from 'reselect'
import { all, call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import { userApi } from '@edulastic/api'
import { notification } from '@edulastic/common'

import { receiveAdminDataAction } from '../SchoolAdmin/ducks'

const RECEIVE_STUDENTLIST_REQUEST = '[student] receive list request'
const RECEIVE_STUDENTLIST_SUCCESS = '[student] receive list success'
const RECEIVE_STUDENTLIST_ERROR = '[student] receive list error'
const UPDATE_STUDENT_REQUEST = '[student] update data request'
const UPDATE_STUDENT_SUCCESS = '[student] update data success'
const UPDATE_STUDENT_ERROR = '[student] update data error'
const CREATE_STUDENT_REQUEST = '[student] create data request'
const CREATE_STUDENT_SUCCESS = '[student] create data success'
const CREATE_STUDENT_ERROR = '[student] create data error'
const DELETE_STUDENT_REQUEST = '[student] delete data request'
const DELETE_STUDENT_SUCCESS = '[student] delete data success'
const DELETE_STUDENT_ERROR = '[student] delete data error'
const ADD_MULTI_STUDENTS_REQUEST = '[student] add multip students request'
const ADD_MULTI_STUDENTS_SUCCESS = '[student] add multip students success'
const ADD_MULTI_STUDENTS_ERROR = '[student] add multip students error'

const SET_STUDENTDETAIL_MODAL_VISIBLE =
  '[student] set student detail modal visible'
const SET_STUDENT_SEARCHNAME = '[student] set search name'
const SET_STUDENT_SETFILTERS = '[student] set filters'
const SET_STUDENTS_TO_OTHER_CLASS_VISIBILITY =
  '[student] set visibility of add students to other class modal'
const ADD_STUDENTS_TO_OTHER_CLASS = '[student] ADD_STUDENTS_TO_OTHER_CLASS'
const ADD_STUDENTS_TO_OTHER_CLASS_SUCCESS =
  '[student] ADD_STUDENTS_TO_OTHER_CLASS_SUCCESS'
const FETCH_CLASS_DETAILS_USING_CODE =
  '[student] FETCH_CLASS_DETAILS_USING_CODE'
const FETCH_CLASS_DETAILS_SUCCESS = '[student] FETCH_CLASS_DETAILS_SUCCESS'
const FETCH_CLASS_DETAILS_FAIL = '[student] FETCH_CLASS_DETAILS_FAIL'

const SET_MULTI_STUDENTS_PROVIDER = '[student] SET_MULTI_STUDENTS_PROVIDER'
const RESET_FETCHED_CLASS_DETAILS_USING_CLASSCODE =
  '[student] RESET_FETCHED _CLASS_DETAILS_USING_CLASSCODE'

const MOVE_USERS_TO_OTHER_CLASS = '[student] move users to another class'
const MOVE_USERS_TO_OTHER_CLASS_SUCCESS =
  '[student] move users to another class success'
const MOVE_USERS_TO_OTHER_CLASS_FAIL =
  '[student] move users to another class success'

export const receiveStudentsListAction = createAction(
  RECEIVE_STUDENTLIST_REQUEST
)
export const receiveStudentsListSuccessAction = createAction(
  RECEIVE_STUDENTLIST_SUCCESS
)
export const receiveStudentsListErrorAction = createAction(
  RECEIVE_STUDENTLIST_ERROR
)
// never used
export const updateStudentAction = createAction(UPDATE_STUDENT_REQUEST)
export const updateStudentSuccessAction = createAction(UPDATE_STUDENT_SUCCESS)
export const updateStudentErrorAction = createAction(UPDATE_STUDENT_ERROR)
export const createStudentAction = createAction(CREATE_STUDENT_REQUEST)
export const createStudentSuccessAction = createAction(CREATE_STUDENT_SUCCESS)
export const createStudentErrorAction = createAction(CREATE_STUDENT_ERROR)
export const deleteStudentAction = createAction(DELETE_STUDENT_REQUEST)
export const deleteStudentSuccessAction = createAction(DELETE_STUDENT_SUCCESS)
export const deleteStudentErrorAction = createAction(DELETE_STUDENT_ERROR)
export const addMultiStudentsRequestAction = createAction(
  ADD_MULTI_STUDENTS_REQUEST
)
export const addMultiStudentsSuccessAction = createAction(
  ADD_MULTI_STUDENTS_SUCCESS
)
export const addMultiStudentsErrorAction = createAction(
  ADD_MULTI_STUDENTS_ERROR
)

export const setStudentsDetailsModalVisibleAction = createAction(
  SET_STUDENTDETAIL_MODAL_VISIBLE
)
export const setSearchNameAction = createAction(SET_STUDENT_SEARCHNAME)
export const setFiltersAction = createAction(SET_STUDENT_SETFILTERS)
export const setAddStudentsToOtherClassVisiblityAction = createAction(
  SET_STUDENTS_TO_OTHER_CLASS_VISIBILITY
)
export const addStudentsToOtherClassAction = createAction(
  ADD_STUDENTS_TO_OTHER_CLASS
)
export const addStudentsToOtherClassSuccess = createAction(
  ADD_STUDENTS_TO_OTHER_CLASS_SUCCESS
)
export const fetchClassDetailsUsingCodeAction = createAction(
  FETCH_CLASS_DETAILS_USING_CODE
)
export const fetchClassDetailsSuccess = createAction(
  FETCH_CLASS_DETAILS_SUCCESS
)
export const fetchClassDetailsFail = createAction(FETCH_CLASS_DETAILS_FAIL)

export const setMultiStudentsProviderAction = createAction(
  SET_MULTI_STUDENTS_PROVIDER
)
export const resetFetchedClassDetailsAction = createAction(
  RESET_FETCHED_CLASS_DETAILS_USING_CLASSCODE
)

export const moveUsersToOtherClassAction = createAction(
  MOVE_USERS_TO_OTHER_CLASS
)
export const moveUsersToOtherClassSuccessAction = createAction(
  MOVE_USERS_TO_OTHER_CLASS_SUCCESS
)
export const moveUsersToOtherClassFailAction = createAction(
  MOVE_USERS_TO_OTHER_CLASS_FAIL
)

// selectors
const stateStudentSelector = (state) => state.studentReducer
export const getStudentsListSelector = createSelector(
  stateStudentSelector,
  (state) => {
    const {
      data = [],
      searchName = '',
      filtersColumn = '',
      filtersText = '',
      filtersValue = '',
    } = state
    if (data.length > 0) {
      const searchByNameData = searchName
        ? data.filter((o) => `${o.firstName} ${o.lastName}` === searchName)
        : data
      const possibleFilterKey = filtersColumn
        ? [filtersColumn]
        : ['firstName', 'lastName', 'email']
      if (filtersText) {
        return filtersValue === 'eq'
          ? searchByNameData.filter(
              (o) =>
                possibleFilterKey.filter((key) => o[key] === filtersText)
                  .length > 0
            )
          : searchByNameData.filter(
              (o) =>
                possibleFilterKey.filter(
                  (key) =>
                    o[key] && o[key].toString().indexOf(filtersText) !== -1
                ).length > 0
            )
      }
      return searchByNameData
    }
    return data
  }
)

export const getAddStudentsToOtherClassSelector = createSelector(
  stateStudentSelector,
  ({ addStudentsToOtherClass }) => addStudentsToOtherClass
)

export const getStudentsLoading = createSelector(
  stateStudentSelector,
  (state) => state.loading
)

export const getValidatedClassDetails = createSelector(
  stateStudentSelector,
  ({ addStudentsToOtherClass: { destinationClassData } }) =>
    destinationClassData
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
  multiStudentsAdding: false,
  multiStudents: {},
  multiStudentsError: null,
  studentDetailsModalVisible: false,
  addStudentsToOtherClass: {
    showModal: false,
    destinationClassData: null,
    successData: null,
    loading: false,
  },
  mutliStudentsProvider: 'google',
  movingUsersToOtherClass: false,
  movingUsersToOtherClassError: null,
}

export const reducer = createReducer(initialState, {
  [RECEIVE_STUDENTLIST_REQUEST]: (state) => {
    state.loading = true
  },
  [RECEIVE_STUDENTLIST_SUCCESS]: (state, { payload }) => {
    const studentsList = []
    for (let i = 0; i < payload.length; i++) {
      const studentData = Object.assign(payload[i], {
        ...payload[i]._source,
        key: i,
      })
      delete studentData._source
      studentsList.push(studentData)
    }

    state.loading = false
    state.data = studentsList
  },
  [RECEIVE_STUDENTLIST_ERROR]: (state, { payload }) => {
    state.loading = false
    state.error = payload.error
  },
  [UPDATE_STUDENT_REQUEST]: (state) => {
    state.updating = true
  },
  [UPDATE_STUDENT_SUCCESS]: (state, { payload }) => {
    const studentsList = state.data.map((student) => {
      if (student._id === payload._id) {
        const newData = {
          ...payload,
        }
        return { ...student, ...newData }
      }
      return student
    })

    state.update = payload
    state.updating = false
    state.data = studentsList
  },
  [UPDATE_STUDENT_ERROR]: (state, { payload }) => {
    state.updating = false
    state.updateError = payload.error
  },
  [CREATE_STUDENT_REQUEST]: (state) => {
    state.creating = true
  },
  [CREATE_STUDENT_SUCCESS]: (state, { payload }) => {
    const createdStudent = {
      key: state.data.length,
      _id: payload._id,
      firstName: payload.firstName,
      lastName: payload.lastName,
      role: payload.role,
      email: payload.email,
      institutionIds: payload.institutionIds,
    }

    state.creating = false
    state.create = createdStudent
    state.data = [createdStudent, ...state.data]
  },
  [CREATE_STUDENT_ERROR]: (state, { payload }) => {
    state.createError = payload.error
    state.creating = false
  },
  [DELETE_STUDENT_REQUEST]: (state) => {
    state.deleting = true
  },
  [DELETE_STUDENT_SUCCESS]: (state, { payload }) => {
    state.delete = payload
    state.deleting = false
    state.data = state.data.filter((studentData) => {
      let nMatchCount = 0
      for (let i = 0; i < payload.length; i++) {
        if (payload[i].userId === studentData._id) nMatchCount++
      }
      return nMatchCount === 0
    })
  },
  [DELETE_STUDENT_ERROR]: (state, { payload }) => {
    state.deleting = false
    state.deleteError = payload.error
  },
  [SET_STUDENT_SEARCHNAME]: (state, { payload }) => {
    state.searchName = payload
  },
  [SET_STUDENT_SETFILTERS]: (state, { payload }) => {
    state.filtersColumn = payload.column
    state.filtersValue = payload.value
    state.filtersText = payload.text
  },
  [ADD_MULTI_STUDENTS_REQUEST]: (state) => {
    state.multiStudentsAdding = true
  },
  [ADD_MULTI_STUDENTS_SUCCESS]: (state, { payload }) => {
    state.multiStudentsAdding = false
    // payload.map((row, index) => {
    //   row.key = index;
    // });
    state.multiStudents = payload
    state.studentDetailsModalVisible = true
  },
  [ADD_MULTI_STUDENTS_ERROR]: (state, { payload }) => {
    state.multiStudentsAdding = false
    state.multiStudentsError = payload.error
  },
  [SET_STUDENTDETAIL_MODAL_VISIBLE]: (state, { payload }) => {
    state.studentDetailsModalVisible = payload
  },
  [SET_STUDENTS_TO_OTHER_CLASS_VISIBILITY]: (
    state,
    { payload: visibility }
  ) => {
    state.addStudentsToOtherClass.showModal = visibility
    state.addStudentsToOtherClass.destinationClassData = null
    state.addStudentsToOtherClass.successData = null
  },
  [FETCH_CLASS_DETAILS_USING_CODE]: (state) => {
    state.addStudentsToOtherClass.loading = true
  },
  [ADD_STUDENTS_TO_OTHER_CLASS_SUCCESS]: (state, { payload }) => {
    state.addStudentsToOtherClass.successData = payload
    state.addStudentsToOtherClass.destinationClassData = null
  },
  [FETCH_CLASS_DETAILS_SUCCESS]: (state, { payload }) => {
    state.addStudentsToOtherClass.destinationClassData = payload
    state.addStudentsToOtherClass.loading = false
    state.addStudentsToOtherClass.successData = null
  },
  [FETCH_CLASS_DETAILS_FAIL]: (state) => {
    state.addStudentsToOtherClass.loading = false
    // when class fetch failed reset earlier fetched class data
    state.addStudentsToOtherClass.destinationClassData = null
    state.addStudentsToOtherClass.successData = null
  },
  [SET_MULTI_STUDENTS_PROVIDER]: (state, { payload }) => {
    state.mutliStudentsProvider = payload
  },
  [RESET_FETCHED_CLASS_DETAILS_USING_CLASSCODE]: (state) => {
    state.addStudentsToOtherClass.destinationClassData = null
    state.addStudentsToOtherClass.successData = null
  },
  [MOVE_USERS_TO_OTHER_CLASS]: (state) => {
    state.movingUsersToOtherClass = true
  },
  [MOVE_USERS_TO_OTHER_CLASS_SUCCESS]: (state) => {
    state.movingUsersToOtherClass = false
  },
  [MOVE_USERS_TO_OTHER_CLASS_FAIL]: (state, { payload }) => {
    state.movingUsersToOtherClass = false
    state.movingUsersToOtherClassErro = payload.error
  },
})

// sagas
function* receiveStudentsListSaga({ payload }) {
  try {
    const { result: studentsList } = yield call(userApi.fetchUsers, payload)
    yield put(receiveStudentsListSuccessAction(studentsList))
  } catch (err) {
    const errorMessage = 'Unable to retrieve students info.'
    notification({ type: 'error', msg: errorMessage })
    yield put(receiveStudentsListErrorAction({ error: errorMessage }))
  }
}

function* updateStudentSaga({ payload }) {
  try {
    const updateStudentData = yield call(userApi.updateUser, payload)
    notification({ type: 'success', messageKey: 'studentUpdatedSuccessfully' })
    yield put(updateStudentSuccessAction(updateStudentData))
  } catch (err) {
    const errorMessage = 'Unable to update student info.'
    notification({ type: 'error', msg: errorMessage })
    yield put(updateStudentErrorAction({ error: errorMessage }))
  }
}

function* createStudentSaga({ payload }) {
  try {
    const createStudent = yield call(userApi.createUser, payload)
    yield put(createStudentSuccessAction(createStudent))
  } catch (err) {
    const errorMessage = 'Unable to create the student.'
    notification({ type: 'error', msg: errorMessage })
    yield put(createStudentErrorAction({ error: errorMessage }))
  }
}

function* deleteStudentSaga({ payload }) {
  try {
    for (let i = 0; i < payload.length; i++) {
      yield call(userApi.deleteUser, payload[i])
    }
    notification({ messageKey: 'studentRemovedSuccessfully' })
    yield put(deleteStudentSuccessAction(payload))
  } catch (err) {
    const errorMessage = 'Unable to remove the student.'
    notification({ type: 'error', msg: errorMessage })
    yield put(deleteStudentErrorAction({ deleteError: errorMessage }))
  }
}

function* addMultiStudentSaga({ payload }) {
  try {
    const addMultiStudents = yield call(
      userApi.addMultipleStudents,
      payload.addReq
    )
    yield put(addMultiStudentsSuccessAction(addMultiStudents))
    // here, since we have a common duck for users tab for calling the api, we make that action,
    // and fetch the fresh data
    yield put(receiveAdminDataAction(payload.listReq))
  } catch (err) {
    const errorMessage = 'Unable to add students.'
    notification({ type: 'error', msg: errorMessage })
    yield put(addMultiStudentsErrorAction({ error: errorMessage }))
  }
}

function* addStudentsToOtherClassSaga({ payload }) {
  try {
    const { result } = yield call(userApi.addStudentsToOtherClass, payload)
    if (!result.status) yield put(addStudentsToOtherClassSuccess(result))
    else notification({ msg: result.status })
  } catch (err) {
    const errorMessage = 'Something went wrong. Please try again'
    notification({ msg: errorMessage })
  }
}

function* fetchClassDetailsUsingCodeSaga({ payload }) {
  try {
    const { result } = yield call(userApi.validateClassCode, payload)
    if (result.isValidClassCode) yield put(fetchClassDetailsSuccess(result))
    else {
      notification({ messageKey: 'invalidClassCode' })
      yield put(fetchClassDetailsFail())
    }
  } catch (err) {
    const errorMessage = 'Something went wrong. Please try again'
    notification({ msg: errorMessage })
    yield put(fetchClassDetailsFail())
  }
}
function* moveUsersToOtherClassSaga({ payload }) {
  try {
    const result = yield call(userApi.moveUsersToOtherClass, payload)
    if (!result.status) yield put(addStudentsToOtherClassSuccess(result))
    else notification({ msg: result.status })
  } catch (err) {
    const errorMessage = 'Unable to move user into target class.'
    notification({ type: 'error', msg: errorMessage })
    yield put(addMultiStudentsErrorAction({ error: errorMessage }))
  }
}

export function* watcherSaga() {
  yield all([takeLatest(RECEIVE_STUDENTLIST_REQUEST, receiveStudentsListSaga)])
  yield all([takeEvery(UPDATE_STUDENT_REQUEST, updateStudentSaga)])
  yield all([takeEvery(CREATE_STUDENT_REQUEST, createStudentSaga)])
  yield all([takeEvery(DELETE_STUDENT_REQUEST, deleteStudentSaga)])
  yield all([takeEvery(ADD_MULTI_STUDENTS_REQUEST, addMultiStudentSaga)])
  yield all([
    takeEvery(ADD_STUDENTS_TO_OTHER_CLASS, addStudentsToOtherClassSaga),
  ])
  yield all([
    takeEvery(FETCH_CLASS_DETAILS_USING_CODE, fetchClassDetailsUsingCodeSaga),
  ])
  yield all([takeEvery(MOVE_USERS_TO_OTHER_CLASS, moveUsersToOtherClassSaga)])
}
