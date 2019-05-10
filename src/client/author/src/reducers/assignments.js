import { concat } from "lodash";
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
  UPDATE_CURRENT_EDITING_ASSIGNMENT,
  TOGGLE_RELEASE_GRADE_SETTINGS,
  ADVANCED_ASSIGNMENT_VIEW
} from "../constants/actions";

const initialState = {
  summaryEntities: [],
  assignmentClassList: [],
  entities: {},
  error: null,
  page: 1,
  limit: 20,
  count: 0,
  loading: false,
  creating: false,
  toggleReleaseGradeSettings: false,
  currentAssignment: {},
  filtering: false,
  isAdvancedView: false
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

    case RECEIVE_ASSIGNMENTS_SUMMARY_REQUEST:
      return { ...state, loading: true, filtering: payload.filtering };
    case RECEIVE_ASSIGNMENTS_SUMMARY_SUCCESS: {
      const { entities = [], filtering } = payload;
      return {
        ...state,
        loading: false,
        summaryEntities: filtering ? entities : concat(state.summaryEntities, entities),
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
    default:
      return state;
  }
};

export default reducer;
