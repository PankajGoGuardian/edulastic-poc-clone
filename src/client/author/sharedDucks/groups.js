import { createAction, createReducer } from 'redux-starter-kit'
import { createSelector } from 'reselect'
import { takeEvery, takeLatest, put, call, select } from 'redux-saga/effects'
import { groupApi, enrollmentApi } from '@edulastic/api'
import { setClassToUserAction } from '../../student/Login/ducks'

const userStatus = {
  ARCHIVED: 0,
  ACTIVE: 1,
  DISABLE: 2,
}

// actions
export const FETCH_GROUPS = '[author groups] fetch owned groups'
export const FETCH_ARCHIVE_GROUPS = '[author groups] fetch owned achive groups'
export const FETCH_GROUP_MEMBERS = '[author groups] fetch students of the group'
export const SET_GROUPS = '[author groups] set groups'
export const SET_ARCHIVE_GROUPS = '[author groups]set archive groups'
export const SET_GROUP_MEMBERS = '[author groups] add students to groups'
export const SET_MULTIPLE_GROUP_MEMBERS =
  '[author groups] set multiple group members'
export const SET_LOADED_GROUPS = '[author groups] set loaded groups'
export const ADD_GROUP = '[author groups] add group'
export const RESET_STUDENTS = '[author groups] reset students list'
export const SET_GROUP_LOADING = '[author groups] set group loading'

// actions
export const fetchGroupsAction = createAction(FETCH_GROUPS)
export const fetchArchiveGroupsAction = createAction(FETCH_ARCHIVE_GROUPS)
export const fetchGroupMembersAction = createAction(FETCH_GROUP_MEMBERS)
export const setGroupsAction = createAction(SET_GROUPS)
export const setArchiveGroupsAction = createAction(SET_ARCHIVE_GROUPS)
export const setGroupMemebersAction = createAction(SET_GROUP_MEMBERS)
export const fetchMultipleGroupMembersAction = createAction(
  SET_MULTIPLE_GROUP_MEMBERS
)
export const setLoadedGroupsAction = createAction(SET_LOADED_GROUPS)
export const addGroupAction = createAction(ADD_GROUP)
export const resetStudentAction = createAction(RESET_STUDENTS)
export const setGroupLoadingAction = createAction(SET_GROUP_LOADING)

// initial state
const initialState = {
  isLoading: false,
  groups: [],
  archiveGroups: [],
  students: [],
  loadedGroups: [],
}

// set groups
const setGroups = (state, { payload }) => {
  state.groups = payload
  state.isLoading = false
}
// set archive groups
const setArchiveGroups = (state, { payload }) => {
  state.archiveGroups = payload
  state.isLoading = false
}

// set loading to true
const setLoading = (state) => {
  state.isLoading = true
}

// populate groups
const populateGroups = (state, { payload = [] }) => {
  const { students = [] } = state

  const studentsMap = {}
  for (const student of students) {
    studentsMap[`${student.groupId}_${student._id}`] = student
  }

  // updating student list
  // checking if student exist with same _id
  // if exists then update the studentsMap with student object
  // and filter that element from payload
  const newPayload = payload
    .filter(({ enrollmentStatus }) => enrollmentStatus > 0)
    .filter((student) => {
      if (studentsMap[`${student.groupId}_${student._id}`]) {
        studentsMap[`${student.groupId}_${student._id}`] = student
        return false
      }
      return true
    })

  // append remaining students(payload) to the students array
  state.students = [...Object.values(studentsMap), ...newPayload]
}

const setLoadedGroups = (state, { payload }) => {
  state.loadedGroups = payload
}

const addGroup = (state, { payload }) => {
  state.groups = [...state.groups, payload]
}

const resetStudents = (state) => {
  state.students = []
}

// default reducer
export default createReducer(initialState, {
  [FETCH_GROUPS]: setLoading,
  [SET_GROUPS]: setGroups,
  [SET_ARCHIVE_GROUPS]: setArchiveGroups,
  [SET_GROUP_MEMBERS]: populateGroups,
  [SET_LOADED_GROUPS]: setLoadedGroups,
  [ADD_GROUP]: addGroup,
  [RESET_STUDENTS]: resetStudents,
  [SET_GROUP_LOADING]: setLoading,
})

// selectors
const _module = 'authorGroups'
export const getGroupsSelector = (state) =>
  state[_module].isLoading ? [] : state[_module].groups
export const getArchiveGroupsSelector = (state) =>
  state[_module].isLoading ? [] : state[_module].archiveGroups
export const getStudentsSelector = (state) =>
  state[_module].isLoading ? [] : state[_module].students

export const getActiveStudentsSelector = createSelector(
  getStudentsSelector,
  (students) => students.filter((item) => item.status === userStatus.ACTIVE)
)

export const getLoadedGroupsSelector = (state) => state[_module].loadedGroups
export const groupsLoadingSelector = (state) => state[_module].isLoading

// fetch groups of that user
function* fetchGroups({ payload }) {
  try {
    const data = yield call(groupApi.fetchMyGroups)
    yield put(setGroupsAction(data))
    if (payload && payload.isCanvasClassSync)
      yield put(setClassToUserAction(data))
  } catch (err) {
    console.log(err)
  }
}
//
function* fetchArchiveGroups() {
  try {
    const data = yield call(groupApi.fetchMyArchiveGroups)
    yield put(setArchiveGroupsAction(data))
  } catch (err) {
    console.log(err)
  }
}

// fetch members of a particular group
function* fetchMembers({ payload }) {
  try {
    const { classId = [] } = payload
    const loadedGroups = yield select(getLoadedGroupsSelector)
    if (loadedGroups.includes(classId)) {
      return
    }
    const { students = [] } = yield call(enrollmentApi.fetch, classId)
    setLoadedGroupsAction([...loadedGroups, classId])
    yield put(
      setGroupMemebersAction(
        students.map((student) => ({ ...student, groupId: classId }))
      )
    )
  } catch (err) {
    console.log(err)
  }
}

function* fetchMultipleGroupMembers({ payload }) {
  try {
    const groupIds = payload || []
    const loadedGroups = yield select(getLoadedGroupsSelector)
    const newGroups = groupIds.filter((id) => !loadedGroups.includes(id))
    if (!newGroups.length) {
      return
    }
    const allStudents = yield call(enrollmentApi.fetchByIds, groupIds)
    yield put(setGroupMemebersAction(allStudents))
    setLoadedGroupsAction([...groupIds, ...newGroups])
  } catch (err) {
    console.log(err)
  }
}

export function* authorGroupsWatcherSaga() {
  yield takeLatest(FETCH_GROUPS, fetchGroups)
  yield takeLatest(FETCH_ARCHIVE_GROUPS, fetchArchiveGroups)
  yield takeEvery(FETCH_GROUP_MEMBERS, fetchMembers)
  yield takeLatest(SET_MULTIPLE_GROUP_MEMBERS, fetchMultipleGroupMembers)
}
