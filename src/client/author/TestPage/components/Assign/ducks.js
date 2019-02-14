import { assignmentApi, enrollmentApi, groupApi } from '@edulastic/api';
import { all, call, put, takeEvery, select } from 'redux-saga/effects';
import { getTestSelector } from '../../ducks';
import { getUserIdSelector } from '../../../src/selectors/user';

// constants

export const ADD_ASSIGNMENT = '[assignments] add assignment';
export const SET_ASSIGNMENT = '[assignments] set assignment';
export const UPDATE_ASSIGNMENT = '[assignments] update assignment';
export const UPDATE_SET_ASSIGNMENT = '[assignments] update set assingment';
export const FETCH_ASSIGNMENTS = '[assignments] fetch assignments';
export const LOAD_ASSIGNMENTS = '[assignments] load assignments';
export const DELETE_ASSIGNMENT = '[assignments] delete assignment';
export const REMOVE_ASSIGNMENT = '[assignments] remove assignment';

// groupConstants

export const FETCH_GROUP_STUDENTS = '[group] fetch students of group';
export const FETCH_GROUPS = '[group] fetch owner groups';
export const SET_GROUPS = '[group] set owner groups';
export const SET_GROUP_STUDENTS = '[group] set group students';

// actions

export const setAssignmentAction = obj => ({
  type: SET_ASSIGNMENT,
  payload: { obj }
});

export const updateSetAssigmentAction = (data, id) => ({
  type: UPDATE_SET_ASSIGNMENT,
  payload: { data, id }
});

export const loadAssignmentsActions = data => ({
  type: LOAD_ASSIGNMENTS,
  payload: { data }
});

export const removeAssignmentsAction = id => ({
  type: REMOVE_ASSIGNMENT,
  payload: { id }
});

export const setGroupsAction = data => ({
  type: SET_GROUPS,
  payload: { data }
});

export const setGroupStudentsAction = (students, classId) => ({
  type: SET_GROUP_STUDENTS,
  payload: { students, classId }
});

export const addAssignmentAction = data => ({
  type: ADD_ASSIGNMENT,
  payload: { data }
});

export const updateAssignmentAction = data => ({
  type: UPDATE_ASSIGNMENT,
  payload: { data }
});

export const fetchAssignmentsAction = () => ({
  type: FETCH_ASSIGNMENTS
});

export const deleteAssignmentAction = id => ({
  type: DELETE_ASSIGNMENT,
  payload: { id }
});

// groupActions

export const fetchGroupsAction = () => ({
  type: FETCH_GROUPS
});

export const fetchStudentsOfGroupAction = data => ({
  type: FETCH_GROUP_STUDENTS,
  payload: {
    ...data
  }
});

// reducer

const initalState = [];

export const reducer = (state = initalState, { type, payload }) => {
  switch (type) {
    case SET_GROUPS:
      return payload.data;
    case SET_GROUP_STUDENTS:
      return state.map((group) => {
        if (group._id === payload.classId) {
          return {
            ...group,
            students: payload.students
          };
        }
        return group;
      });
    default:
      return state;
  }
};

// saga

function* assignmentTestsSaga({ payload }) {
  try {
    const userId = yield select(getUserIdSelector);
    const obj = {
      ...payload.data,
      assignedBy: {
        id: userId
      }
    };

    // FIXME: move it out

    const group = yield select(state => state.group);
    const students = obj.specificStudents && obj.students;

    if (obj.specificStudents === false) {
      obj.students = [];
    }
    const data = yield call(assignmentApi.create, [obj]);
    const assignment = data[0];
    yield put(setAssignmentAction(assignment));
  } catch (err) {
    console.error(err);
  }
}

function* updateAssignmentTestsSaga({ payload }) {
  try {
    const userId = yield select(getUserIdSelector);
    const obj = {
      ...payload.data,
      assignedBy: {
        id: userId
      }
    };

    if (obj.specificStudents === false) {
      obj.students = [];
    }

    const { id } = obj;
    delete obj.key;
    delete obj.id;

    const data = yield call(assignmentApi.update, id, obj);
    yield put(updateSetAssigmentAction(data, id));
  } catch (err) {
    console.error(err);
  }
}

function* loadAssignments() {
  try {
    const { _id: testId } = yield select(getTestSelector);
    const data = yield call(assignmentApi.fetchAssignments, testId);
    yield put(loadAssignmentsActions(data));
  } catch (e) {
    console.error(e);
  }
}

function* deleteAssignment({ payload: { id } }) {
  try {
    yield assignmentApi.remove(id);
    yield put(removeAssignmentsAction(id));
  } catch (e) {
    console.log(e);
  }
}

// groupSaga

function* loadGroups() {
  try {
    const data = yield call(groupApi.fetchMyGroups);
    yield put(setGroupsAction(data));
  } catch (err) {
    console.log(err);
  }
}

// closure can be lovely little cache  😚
const fetchStudents = () => {
  const groupIdCache = [];
  return function* ({ payload }) {
    try {
      const { classId } = payload;
      if (groupIdCache.includes(classId)) {
        return;
      }

      const students = yield call(enrollmentApi.fetch, classId);
      groupIdCache.push(classId);
      yield put(setGroupStudentsAction(students, classId));
    } catch (err) {
      console.log(err);
    }
  };
};

export function* watcherSaga() {
  yield all([
    yield takeEvery(ADD_ASSIGNMENT, assignmentTestsSaga),
    yield takeEvery(UPDATE_ASSIGNMENT, updateAssignmentTestsSaga),
    yield takeEvery(FETCH_ASSIGNMENTS, loadAssignments),
    yield takeEvery(DELETE_ASSIGNMENT, deleteAssignment),
    yield takeEvery(FETCH_GROUPS, loadGroups),
    yield takeEvery(FETCH_GROUP_STUDENTS, fetchStudents())
  ]);
}

// selectors

export const getGroupSelector = state => state.testsAssign;
