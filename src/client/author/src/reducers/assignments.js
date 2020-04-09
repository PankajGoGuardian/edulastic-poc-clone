import {
  RECEIVE_ASSIGNMENTS_REQUEST,
  RECEIVE_ASSIGNMENTS_SUCCESS,
  RECEIVE_ASSIGNMENTS_SUMMARY_REQUEST,
  RECEIVE_ASSIGNMENTS_SUMMARY_SUCCESS,
  RECEIVE_ASSIGNMENTS_SUMMARY_ERROR,
  RECEIVE_ASSIGNMENT_CLASS_LIST_REQUEST,
  RECEIVE_ASSIGNMENT_CLASS_LIST_SUCCESS,
  RECEIVE_ASSIGNMENT_CLASS_LIST_ERROR,
  RECEIVE_ASSIGNMENTS_ERROR,
  SET_ASSIGNMENT_FILTER,
  UPDATE_CURRENT_EDITING_ASSIGNMENT,
  TOGGLE_RELEASE_GRADE_SETTINGS,
  ADVANCED_ASSIGNMENT_VIEW,
  TOGGLE_DELETE_ASSIGNMENT_MODAL,
  DELETE_ASSIGNMENT_REQUEST,
  DELETE_ASSIGNMENT_REQUEST_SUCCESS,
  DELETE_ASSIGNMENT_REQUEST_FAILED,
  SYNC_ASSIGNMENT_WITH_GOOGLE_CLASSROOM_SUCCESS,
  SYNC_ASSIGNMENT_WITH_GOOGLE_CLASSROOM_REQUEST,
  SYNC_ASSIGNMENT_WITH_GOOGLE_CLASSROOM_ERROR
} from "../constants/actions";
import { getFromLocalStorage } from "@edulastic/api/src/utils/Storage";
import { find, keyBy } from "lodash";

const initialState = {
  summaryEntities: [],
  assignmentClassList: [],
  entities: {},
  error: null,
  page: 1,
  limit: 20,
  count: 0,
  total: 0,
  loading: false,
  filter: JSON.parse(getFromLocalStorage("filterAssignments")) || {},
  creating: false,
  toggleReleaseGradeSettings: false,
  currentAssignment: {},
  filtering: false,
  isAdvancedView: false,
  syncWithGoogleClassroomInProgress: false
};

const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case RECEIVE_ASSIGNMENTS_REQUEST:
      return { ...state, loading: true };
    case RECEIVE_ASSIGNMENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        entities: payload.entities
      };
    case RECEIVE_ASSIGNMENTS_ERROR:
      return { ...state, loading: false, error: payload.error };
    case SET_ASSIGNMENT_FILTER:
      return { ...state, filter: { ...payload } };
    case RECEIVE_ASSIGNMENTS_SUMMARY_REQUEST:
      return { ...state, loading: true, filtering: payload.filtering };
    case RECEIVE_ASSIGNMENTS_SUMMARY_SUCCESS: {
      const { entities = [], total } = payload;
      return {
        ...state,
        loading: false,
        summaryEntities: entities,
        total,
        filtering: false
      };
    }
    case RECEIVE_ASSIGNMENTS_SUMMARY_ERROR:
      return { ...state, loading: false, error: payload.error };
    case RECEIVE_ASSIGNMENT_CLASS_LIST_REQUEST:
      return { ...state, loading: true, assignmentClassList: [] };
    case RECEIVE_ASSIGNMENT_CLASS_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        assignmentClassList: payload.entities
      };
    case RECEIVE_ASSIGNMENT_CLASS_LIST_ERROR:
      return { ...state, loading: false, error: payload.error };
    case UPDATE_CURRENT_EDITING_ASSIGNMENT:
      return {
        ...state,
        currentAssignment: payload
      };
    case TOGGLE_RELEASE_GRADE_SETTINGS:
      return {
        ...state,
        toggleReleaseGradeSettings: payload
      };
    case ADVANCED_ASSIGNMENT_VIEW:
      return {
        ...state,
        isAdvancedView: !state.isAdvancedView
      };
    case TOGGLE_DELETE_ASSIGNMENT_MODAL:
      return {
        ...state,
        toggleDeleteAssignmentModalState: payload
      };
    case DELETE_ASSIGNMENT_REQUEST_SUCCESS:
      const keyMap = keyBy(payload);
      const assignment = find(state.entities.assignments, item => keyMap[item._id]);

      if (assignment) {
        const testId = assignment.testId;
        const _assignments = state.entities.assignments.filter(item => !keyMap[item._id]);
        const _assignment = find(_assignments, item => item.testId === testId);
        if (!_assignment) {
          return {
            ...state,
            entities: {
              tests: state.entities.tests.filter(item => item._id !== testId),
              assignments: _assignments
            }
          };
        } else {
          return {
            ...state,
            entities: {
              ...state.entities,
              assignments: _assignments
            }
          };
        }
      }
    case SYNC_ASSIGNMENT_WITH_GOOGLE_CLASSROOM_REQUEST:
      return {
        ...state,
        syncWithGoogleClassroomInProgress: true
      };
    case SYNC_ASSIGNMENT_WITH_GOOGLE_CLASSROOM_SUCCESS:
      return {
        ...state,
        syncWithGoogleClassroomInProgress: false
      };
    case SYNC_ASSIGNMENT_WITH_GOOGLE_CLASSROOM_ERROR:
      return {
        ...state,
        syncWithGoogleClassroomInProgress: false
      };
    default:
      return state;
  }
};

export default reducer;
