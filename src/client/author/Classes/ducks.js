import { createAction, createReducer } from 'redux-starter-kit'
import { createSelector } from 'reselect'
import {
  takeLatest,
  takeEvery,
  call,
  put,
  all,
  select,
} from 'redux-saga/effects'
import { push } from 'connected-react-router'
import { googleApi, groupApi, userApi } from '@edulastic/api'
import { captureSentryException, notification } from '@edulastic/common'
import { keyBy } from 'lodash'
import { roleuser } from '@edulastic/constants'
import { showAddCoTeacherModalAction } from '../ManageClass/ducks'
import { setClassToUserAction } from '../../student/Login/ducks'
import { getOrgGroupList, getUserRole } from '../src/selectors/user'

const RECEIVE_CLASSLIST_REQUEST = '[class] receive list request'
export const RECEIVE_CLASSLIST_SUCCESS = '[class] receive list success'
export const RECEIVE_CLASSLIST_ERROR = '[class] receive list error'
const CLEAR_CLASSLIST = '[class] clear list'
const UPDATE_CLASS_REQUEST = '[class] update data request'
const UPDATE_CLASS_SUCCESS = '[class] update data success'
const UPDATE_CLASS_ERROR = '[class] update data error'
const CREATE_CLASS_REQUEST = '[class] create data request'
const CREATE_CLASS_SUCCESS = '[class] create data success'
const CREATE_CLASS_ERROR = '[class] create data error'
const DELETE_CLASS_REQUEST = '[class] delete data request'
const DELETE_CLASS_SUCCESS = '[class] delete data success'
const DELETE_CLASS_ERROR = '[class] delete data error'
const ADD_COTEACHER_TO_GROUPS_SUCCESS =
  '[class] add coTeacher to groups success'
const SET_BULK_EDIT_VISIBILITY = '[class] SET_BULK_EDIT_VISIBILITY'
const SET_BULK_EDIT_MODE = '[class] SET_BULK_EDIT_MODE'
const SET_BULK_EDIT_UPDATE_VIEW = '[class] SET_BULK_EDIT_UPDATE_VIEW'
const BULK_UPDATE_CLASSES = '[class] BULK_UPDATE_CLASSES'
const BULK_UPDATE_CLASSES_SUCCESS = '[class] BULK_UPDATE_CLASSES_SUCCESS'

const RECEIVE_TEACHERLIST_REQUEST = '[teacher] receive data request'
const RECEIVE_TEACHERLIST_SUCCESS = '[teacher] receive data success'
const RECEIVE_TEACHERLIST_ERROR = '[teacher] receive data error'

const ARCHIVE_CLASS_REQUEST = '[class] archive class request'
const ARCHIVE_CLASS_SUCCESS = '[class] archive class success'
const ARCHIVE_CLASS_ERROR = '[class ] archive class error'

const SAVE_HANGOUT_EVENT_REQUEST = '[class] save hangouts event request'
const SAVE_HANGOUT_EVENT_SUCCESS = '[class] save hangouts event success'
const SAVE_HANGOUT_EVENT_ERROR = '[class] save hangouts event error'
const SET_OPEN_HANGOUT_MEETING = '[class] set open hangouts meeting'

const UPDATE_HANGOUT_EVENT_REQUEST = '[class] update hangouts event request'

const ADD_COTEACHER_TO_GROUPS = '[class] add coTeacher to groups'

export const receiveClassListAction = createAction(RECEIVE_CLASSLIST_REQUEST)
export const receiveClassListSuccessAction = createAction(
  RECEIVE_CLASSLIST_SUCCESS
)
export const receiveClassListErrorAction = createAction(RECEIVE_CLASSLIST_ERROR)
export const clearClassListAction = createAction(CLEAR_CLASSLIST)
export const updateClassAction = createAction(UPDATE_CLASS_REQUEST)
export const updateClassSuccessAction = createAction(UPDATE_CLASS_SUCCESS)
export const updateClassErrorAction = createAction(UPDATE_CLASS_ERROR)
export const createClassAction = createAction(CREATE_CLASS_REQUEST)
export const createClassSuccessAction = createAction(CREATE_CLASS_SUCCESS)
export const createClassErrorAction = createAction(CREATE_CLASS_ERROR)
export const deleteClassAction = createAction(DELETE_CLASS_REQUEST)
export const deleteClassSuccessAction = createAction(DELETE_CLASS_SUCCESS)
export const deleteClassErrorAction = createAction(DELETE_CLASS_ERROR)
export const addCoTeacherToGroupSuccessAction = createAction(
  ADD_COTEACHER_TO_GROUPS_SUCCESS
)

export const receiveTeacherListAction = createAction(
  RECEIVE_TEACHERLIST_REQUEST
)
export const receiveTeacherListSuccessAction = createAction(
  RECEIVE_TEACHERLIST_SUCCESS
)
export const receiveTeacherListErrorAction = createAction(
  RECEIVE_TEACHERLIST_ERROR
)
export const setBulkEditVisibilityAction = createAction(
  SET_BULK_EDIT_VISIBILITY
)
export const setBulkEditModeAction = createAction(SET_BULK_EDIT_MODE)
export const setBulkEditUpdateViewAction = createAction(
  SET_BULK_EDIT_UPDATE_VIEW
)
export const bulkUpdateClassesAction = createAction(BULK_UPDATE_CLASSES)
export const bulkUpdateClassesSuccessAction = createAction(
  BULK_UPDATE_CLASSES_SUCCESS
)

export const archiveClassAction = createAction(ARCHIVE_CLASS_REQUEST)
export const archiveClassSuccessAction = createAction(ARCHIVE_CLASS_SUCCESS)
export const archiveClassErrorAction = createAction(ARCHIVE_CLASS_ERROR)

export const saveHangoutEventRequestAction = createAction(
  SAVE_HANGOUT_EVENT_REQUEST
)
export const saveHangoutEventSuccessAction = createAction(
  SAVE_HANGOUT_EVENT_SUCCESS
)
export const saveHangoutEventErrorAction = createAction(
  SAVE_HANGOUT_EVENT_ERROR
)

export const updateHangoutEventRequestAction = createAction(
  UPDATE_HANGOUT_EVENT_REQUEST
)

export const setHangoutOpenMeetingAction = createAction(
  SET_OPEN_HANGOUT_MEETING
)

export const addCoTeacherToGroupsAction = createAction(ADD_COTEACHER_TO_GROUPS)

// selectors
const stateClassSelector = (state) => state.classesReducer
export const getClassListSelector = createSelector(
  stateClassSelector,
  (state) => state.data
)

export const getBulkEditSelector = createSelector(
  stateClassSelector,
  ({ bulkEdit }) => bulkEdit
)

export const getSavedGroupHangoutEvent = createSelector(
  stateClassSelector,
  (state) => state.savedHangoutEvent
)

export const openHangoutMeeting = createSelector(
  stateClassSelector,
  (state) => state.openMeeting
)

// reducers
const initialState = {
  data: {},
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
  teacherLoading: false,
  teacherList: {},
  teacherError: '',
  totalClassCount: 0,
  bulkEdit: {
    showModal: false,
    updateMode: 'course',
    updateView: false,
  },
  archiving: false,
  archiveError: null,
  archiveSuccess: null,
  openMeeting: false,
}

export const reducer = createReducer(initialState, {
  [RECEIVE_CLASSLIST_REQUEST]: (state) => {
    state.loading = true
  },
  [RECEIVE_CLASSLIST_SUCCESS]: (state, { payload: { hits, total } }) => {
    state.loading = false
    state.data = keyBy(hits, '_id')
    state.totalClassCount = total
  },
  [RECEIVE_CLASSLIST_ERROR]: (state, { payload }) => {
    state.loading = false
    state.error = payload.error
  },
  [CLEAR_CLASSLIST]: (state) => {
    state.data = {}
  },
  [UPDATE_CLASS_REQUEST]: (state) => {
    state.updating = true
  },
  [UPDATE_CLASS_SUCCESS]: (state, { payload }) => {
    state.update = payload
    state.updating = false

    state.data[payload._id]._source = {
      ...state.data[payload._id]._source,
      ...payload,
    }
  },
  [UPDATE_CLASS_ERROR]: (state, { payload }) => {
    state.updating = false
    state.updateError = payload.error
  },
  [CREATE_CLASS_REQUEST]: (state) => {
    state.creating = true
  },
  [CREATE_CLASS_SUCCESS]: (state, { payload }) => {
    // const createdStudent = { key: payload._id, ...payload };
    state.creating = false
    state.create = payload
    const createdStudent = {
      [payload._id]: {
        _id: payload._id,
        _source: payload,
      },
    }
    // here we use the spread operator for the created student, so that the created student
    // appears first in the list
    state.data = { ...createdStudent, ...state.data }
    // state.data[payload._id] = payload;
  },
  [CREATE_CLASS_ERROR]: (state, { payload }) => {
    state.createError = payload.error
    state.creating = false
  },
  [DELETE_CLASS_REQUEST]: (state) => {
    state.deleting = true
  },
  [DELETE_CLASS_SUCCESS]: (state, { payload }) => {
    state.delete = payload
    state.deleting = false
  },
  [DELETE_CLASS_ERROR]: (state, { payload }) => {
    state.deleting = false
    state.deleteError = payload.error
  },
  [ADD_COTEACHER_TO_GROUPS_SUCCESS]: (state, { payload }) => {
    const groupsData = payload?.groupsData || []
    for (let i = 0; i < groupsData.length; i++) {
      state.data[groupsData[i]._id]._source = {
        ...state.data[groupsData[i]._id]._source,
        ...groupsData[i],
      }
    }
  },
  [RECEIVE_TEACHERLIST_REQUEST]: (state) => {
    state.teacherLoading = true
  },
  [RECEIVE_TEACHERLIST_SUCCESS]: (state, { payload }) => {
    const teachersList = []
    for (let i = 0; i < payload.length; i++) {
      let teacherData = {}
      teacherData = payload[i]
      teacherData.key = i
      if (teacherData._source) {
        teacherData = { ...teacherData, ...teacherData._source }
      }
      delete teacherData._source
      teachersList.push(teacherData)
    }
    state.teacherLoading = false
    state.teacherList = teachersList
  },
  [RECEIVE_TEACHERLIST_ERROR]: (state, { payload }) => {
    state.teacherLoading = false
    state.teacherError = payload.error
  },
  [SET_BULK_EDIT_VISIBILITY]: (state, { payload: visibility }) => {
    state.bulkEdit.showModal = visibility
    state.bulkEdit.updateView = false
  },
  [SET_BULK_EDIT_MODE]: (state, { payload: value }) => {
    state.bulkEdit.updateMode = value
  },
  [SET_BULK_EDIT_UPDATE_VIEW]: (state, { payload: visibility }) => {
    state.bulkEdit.updateView = visibility
  },
  [BULK_UPDATE_CLASSES_SUCCESS]: (state) => {
    state.bulkEdit = {
      showModal: false,
      updateMode: 'course',
      updateView: false,
    }
  },
  [ARCHIVE_CLASS_REQUEST]: (state) => {
    state.archiving = true
  },
  [ARCHIVE_CLASS_SUCCESS]: (state, { payload }) => {
    state.archiving = false
    state.archiveSuccess = payload.archiveSuccess
  },
  [ARCHIVE_CLASS_ERROR]: (state, { payload }) => {
    state.archiving = false
    state.archiveError = payload.archiveError
  },
  [SAVE_HANGOUT_EVENT_REQUEST]: (state) => {
    state.saving = true
  },
  [SAVE_HANGOUT_EVENT_SUCCESS]: (state, { payload }) => {
    state.openMeeting = true
    state.savedHangoutEvent = payload.savedGroup
  },
  [SAVE_HANGOUT_EVENT_ERROR]: (state) => {
    state.saving = false
  },
  [SET_OPEN_HANGOUT_MEETING]: (state, { payload }) => {
    state.openMeeting = payload.status
  },
  [UPDATE_HANGOUT_EVENT_REQUEST]: (state) => {
    state.saving = true
  },
})

// sagas
function* receiveClassListSaga({ payload }) {
  try {
    const hits = yield call(groupApi.getGroups, payload)
    yield put(receiveClassListSuccessAction(hits))
  } catch (err) {
    captureSentryException(err)
    const errorMessage = 'Unable to fetch current class information.'
    notification({ type: 'error', msg: errorMessage })
    yield put(receiveClassListErrorAction({ error: errorMessage }))
  }
}

function* updateClassSaga({ payload }) {
  try {
    const updateClassData = yield call(groupApi.editGroup, payload)
    yield put(updateClassSuccessAction(updateClassData))
    notification({ type: 'success', messageKey: 'classUpdatedSuccessfully' })
  } catch (err) {
    captureSentryException(err)
    const errorMessage = 'Unable to fetch update class information.'
    notification({ type: 'error', msg: errorMessage })
    yield put(updateClassErrorAction({ error: errorMessage }))
  }
}

function* createClassSaga({ payload }) {
  try {
    const createClass = yield call(groupApi.createGroup, payload)
    yield put(createClassSuccessAction(createClass))
    notification({ type: 'success', messageKey: 'classCreatedSuccessfully' })
  } catch (err) {
    captureSentryException(err)
    const errorMessage = 'Unable to create class.'
    notification({ type: 'error', msg: errorMessage })
    yield put(createClassErrorAction({ error: errorMessage }))
  }
}

function* deleteClassSaga({ payload }) {
  try {
    yield call(groupApi.deleteGroup, payload.data)
    yield put(deleteClassSuccessAction(payload))
    yield put(receiveClassListAction(payload.searchQuery))
    notification({ type: 'success', messageKey: 'selectedClassesArchived' })
  } catch (err) {
    captureSentryException(err)
    const errorMessage = 'Unable to delete the class group. Please try again.'
    notification({ msg: errorMessage })
    yield put(deleteClassErrorAction({ deleteError: errorMessage }))
  }
}
function* addCoTeacherToGroupsSaga({ payload }) {
  try {
    const data = yield call(groupApi.addCoTeacher, payload)
    yield put(addCoTeacherToGroupSuccessAction(data))
    yield put(showAddCoTeacherModalAction(false))
    notification({
      type: 'success',
      messageKey: 'coTeacherAddedSuccessfully',
    })
  } catch (err) {
    notification({ msg: err.response.data.message })
  }
}

function* receiveTeachersListSaga({ payload }) {
  try {
    const { result: teachersList } = yield call(userApi.fetchUsers, payload)
    yield put(receiveTeacherListSuccessAction(teachersList))
  } catch (err) {
    captureSentryException(err)
    const errorMessage = 'Unable to gather teachers list.'
    notification({ type: 'error', msg: errorMessage })
    yield put(receiveTeacherListErrorAction({ error: errorMessage }))
  }
}

function* bulkUpdateClassesSaga({ payload }) {
  try {
    const { result } = yield call(groupApi.bulkUpdateClasses, payload.data)
    yield put(receiveClassListAction(payload.searchQuery))
    yield put(bulkUpdateClassesSuccessAction(result))
    const successMessage =
      'Bulk update request is submitted successfully! New changes will start reflecting soon.'
    notification({ type: 'success', msg: successMessage })
  } catch (err) {
    captureSentryException(err)
    const errorMessage = 'Something went wrong.'
    notification({ type: 'error', msg: errorMessage })
  }
}

function* archiveClassSaga({ payload }) {
  const { isGroup, exitPath, ...restPayload } = payload || {}
  const groupTypeText = isGroup ? 'Group' : 'Class'
  try {
    yield call(groupApi.archiveGroup, restPayload)
    const successMessage = `${groupTypeText} Archived Successfully`
    notification({ type: 'success', msg: successMessage })
    yield put(archiveClassSuccessAction({ archiveSuccess: successMessage }))
    if (exitPath) yield put(push('/'))
    yield put(push(exitPath || '/author/manageClass'))
    const role = yield select(getUserRole)
    if (role === roleuser.TEACHER) {
      const userClassList = yield select(getOrgGroupList)
      // update archived class in user orgdata
      const updatedUserClassList = userClassList.map((c) => {
        if (c._id === restPayload._id) {
          c.active = 0
        }
        return c
      })
      yield put(setClassToUserAction(updatedUserClassList))
      yield put(clearClassListAction())
    }
  } catch (err) {
    captureSentryException(err)
    const errorMessage = `Unable to archive ${groupTypeText}.`
    notification({ type: 'error', msg: errorMessage })
    yield put(archiveClassErrorAction({ archiveError: errorMessage }))
  }
}

function* saveHangoutEventSaga({ payload }) {
  try {
    const postMeeting = payload.postMeeting
    delete payload.postMeeting
    const savedGroup = yield call(groupApi.saveHangoutEvent, payload)
    if (postMeeting) {
      yield call(googleApi.postGoogleClassRoomAnnouncement, {
        groupId: payload.groupId,
      })
    }
    const successMessage = 'Google Meet event saved successfully'
    notification({ type: 'success', msg: successMessage })
    yield put(saveHangoutEventSuccessAction({ savedGroup }))
  } catch (err) {
    captureSentryException(err)
    const errorMessage = 'Unable to save Google Meet event.'
    notification({ type: 'error', msg: errorMessage })
    yield put(saveHangoutEventErrorAction())
  }
}

function* updateHangoutEventSaga({ payload }) {
  try {
    const { postMeeting, ...rest } = payload
    const savedGroup = yield call(groupApi.updateHangoutEvent, rest)
    if (postMeeting) {
      yield call(googleApi.postGoogleClassRoomAnnouncement, {
        groupId: payload.groupId,
      })
    }
    const successMessage = 'Hangouts event updated successfully'
    notification({ type: 'success', msg: successMessage })
    yield put(saveHangoutEventSuccessAction({ savedGroup }))
  } catch (err) {
    captureSentryException(err)
    const errorMessage = 'Unable to update Hangouts event.'
    notification({ type: 'error', msg: errorMessage })
    yield put(saveHangoutEventErrorAction())
  }
}

export function* watcherSaga() {
  yield all([yield takeLatest(RECEIVE_CLASSLIST_REQUEST, receiveClassListSaga)])
  yield all([yield takeEvery(UPDATE_CLASS_REQUEST, updateClassSaga)])
  yield all([yield takeEvery(CREATE_CLASS_REQUEST, createClassSaga)])
  yield all([yield takeEvery(DELETE_CLASS_REQUEST, deleteClassSaga)])
  yield all([
    yield takeEvery(RECEIVE_TEACHERLIST_REQUEST, receiveTeachersListSaga),
  ])
  yield all([yield takeEvery(BULK_UPDATE_CLASSES, bulkUpdateClassesSaga)])
  yield all([yield takeEvery(ARCHIVE_CLASS_REQUEST, archiveClassSaga)])
  yield all([yield takeEvery(SAVE_HANGOUT_EVENT_REQUEST, saveHangoutEventSaga)])
  yield all([
    yield takeEvery(UPDATE_HANGOUT_EVENT_REQUEST, updateHangoutEventSaga),
  ])
  yield all([
    yield takeEvery(ADD_COTEACHER_TO_GROUPS, addCoTeacherToGroupsSaga),
  ])
}
