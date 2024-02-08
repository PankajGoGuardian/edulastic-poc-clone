import { takeEvery, takeLatest, call, put, all } from 'redux-saga/effects'
import { collaborationApi } from '@edulastic/api'
import { createAction, createReducer } from 'redux-starter-kit'
import { captureSentryException, notification } from '@edulastic/common'
import { fetchCollaborationGroupsAction } from '../Groups/ducks'

// constants
export const FETCH_COLLABORATION_GROUP_BY_ID =
  '[collaboration group] fetch by id'
export const SET_GROUP_FETCHING_STATE =
  '[collaboration group] set fetching state'
export const SET_GROUP_DATA = '[collaboration group] set data'
export const FETCH_USERS = '[collaboration group] fetch users'
export const SET_USERS = '[collaboration group] set users'
export const ADD_MEMBERS = '[collaboration group] add members'
export const MAKE_GROUP_ADMIN =
  '[collaboration group] make member(s) group admin'
export const REMOVE_GROUP_ADMIN =
  '[collaboration group] remove member(s) group admin'
export const REMOVE_FROM_GROUP =
  '[collaboration group] remove member(s) from group'

export const SET_ADDING_MEMBERS_STATE =
  '[collaboration group] set adding members state'
export const UPDATE_USER_MEMBERSHIPS_REQUEST =
  '[collaboration group] update user memberships request'
export const UPDATE_GROUP_NAME = '[collaboration group] update group name'

// actions
export const fetchGroupByIdAction = createAction(
  FETCH_COLLABORATION_GROUP_BY_ID
)
export const setGroupFetchingStateAction = createAction(
  SET_GROUP_FETCHING_STATE
)
export const setGroupDataAction = createAction(SET_GROUP_DATA)
export const fetchUsersAction = createAction(FETCH_USERS)
export const setUsersAction = createAction(SET_USERS)
export const addMembersAction = createAction(ADD_MEMBERS)
export const makeGroupAdminAction = createAction(MAKE_GROUP_ADMIN)
export const removeGroupAdminAction = createAction(REMOVE_GROUP_ADMIN)
export const removeFromGroupAction = createAction(REMOVE_FROM_GROUP)
export const setAddingMembersStateAction = createAction(
  SET_ADDING_MEMBERS_STATE
)
export const updateUserMembershipsAction = createAction(
  UPDATE_USER_MEMBERSHIPS_REQUEST
)
export const updateGroupNameAction = createAction(UPDATE_GROUP_NAME)

const initialState = {
  groupData: {},
  fetchingGroupDetails: false,
  userList: [],
  fetchingUsers: false,
  isAddingMembers: false,
}

export default createReducer(initialState, {
  [SET_GROUP_FETCHING_STATE]: (state, { payload }) => {
    state.fetchingGroupDetails = payload
  },
  [SET_GROUP_DATA]: (state, { payload }) => {
    state.groupData = payload
  },
  [SET_USERS]: (state, { payload }) => {
    state.userList = payload.map((user) => ({
      name: user.name,
      _id: user._id,
      username: user.email,
    }))
    state.fetchingUsers = false
  },
  [FETCH_USERS]: (state) => {
    state.fetchingUsers = true
  },
  [SET_ADDING_MEMBERS_STATE]: (state, { payload }) => {
    state.isAddingMembers = payload
  },
})

function* fetchGroupByIdSaga({ payload }) {
  try {
    yield put(setGroupFetchingStateAction(true))
    const data = yield call(collaborationApi.fetchGroupById, payload)
    yield put(setGroupDataAction(data))
    yield put(setGroupFetchingStateAction(false))
  } catch (err) {
    yield put(setGroupFetchingStateAction(false))
    console.error(err)
    captureSentryException(err)
    notification({
      type: 'error',
      msg: 'Failed to fetch group details',
    })
  }
}

function* fetchUsersSaga({ payload }) {
  try {
    const usersList = yield call(collaborationApi.fetchUsersToAdd, payload)
    yield put(setUsersAction(usersList))
  } catch (err) {
    console.error(err)
    captureSentryException(err)
    yield put(setUsersAction([]))
    notification({
      type: 'error',
      msg: 'Failed to fetch list of users',
    })
  }
}

function* addMembersSaga({ payload }) {
  try {
    yield put(setAddingMembersStateAction(true))
    yield call(collaborationApi.addMembers, payload)
    yield put(fetchCollaborationGroupsAction())
    yield put(fetchGroupByIdAction(payload.groupId))
    yield put(setAddingMembersStateAction(false))
    notification({
      type: 'success',
      msg: 'Members successfuly added to the group',
    })
  } catch (err) {
    yield put(setAddingMembersStateAction(false))
    console.error(err)
    captureSentryException(err)
    notification({
      type: 'error',
      msg: 'Failed to add members to the group',
    })
  }
}

function* makeMembersAdminSaga({ payload }) {
  try {
    const data = yield call(collaborationApi.updateMembersRole, payload)
    yield put(setGroupDataAction(data))
    yield call(notification, {
      type: 'success',
      msg: `Selected ${
        payload.count || ''
      } member(s) are marked as group admin.`,
    })
  } catch (err) {
    captureSentryException(err)
    yield call(notification, {
      type: 'error',
      msg: `Error while updating member(s) role.`,
    })
  }
}

function* removeMembersAsAdminSaga({ payload }) {
  try {
    const data = yield call(collaborationApi.updateMembersRole, payload)
    yield put(setGroupDataAction(data))
    yield call(notification, {
      type: 'success',
      msg: `Selected ${payload.count || ''} member(s) are no more group admin.`,
    })
  } catch (err) {
    captureSentryException(err)
    yield call(notification, {
      type: 'error',
      msg: `Error while updating member(s) role.`,
    })
  }
}

function* removeMembersFromGroup({ payload }) {
  try {
    const data = yield call(collaborationApi.removeMembers, payload) || {}
    yield put(setGroupDataAction(data))
    yield call(notification, {
      type: 'success',
      msg: `Removed ${payload.count || ''} member(s) from group successfully.`,
    })
  } catch (err) {
    captureSentryException(err)
    yield call(notification, {
      type: 'error',
      msg: `Error while removing member(s) from group.`,
    })
  }
}

function* updateUserMembershipsSaga({ payload }) {
  try {
    const { groupId, data } = payload
    yield call(collaborationApi.updateUserMemberships, data)
    yield put(fetchCollaborationGroupsAction())
    yield put(fetchGroupByIdAction(groupId))
    notification({
      type: 'success',
      msg: 'User membership(s) updated successfully',
    })
  } catch (err) {
    console.error(err)
    captureSentryException(err)
    notification({
      type: 'error',
      msg: 'Failed to update user membership(s)',
    })
  }
}

function* updateGroupNameSaga({ payload }) {
  try {
    const data = yield call(collaborationApi.updateGroupName, payload)
    console.log({ data })
    yield put(setGroupDataAction(data))
    notification({
      type: 'success',
      msg: 'Group Name updated successfully',
    })
  } catch (err) {
    console.error(err)
    captureSentryException(err)
    notification({
      type: 'error',
      msg: 'Failed to update group name',
    })
  }
}

export function* watcherSaga() {
  yield all([
    takeEvery(FETCH_COLLABORATION_GROUP_BY_ID, fetchGroupByIdSaga),
    takeLatest(FETCH_USERS, fetchUsersSaga),
    takeEvery(ADD_MEMBERS, addMembersSaga),
    takeEvery(MAKE_GROUP_ADMIN, makeMembersAdminSaga),
    takeEvery(REMOVE_GROUP_ADMIN, removeMembersAsAdminSaga),
    takeEvery(REMOVE_FROM_GROUP, removeMembersFromGroup),
    takeEvery(UPDATE_USER_MEMBERSHIPS_REQUEST, updateUserMembershipsSaga),
    takeEvery(UPDATE_GROUP_NAME, updateGroupNameSaga),
  ])
}
