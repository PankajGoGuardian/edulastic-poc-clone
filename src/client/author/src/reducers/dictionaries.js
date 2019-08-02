import {
  RECEIVE_DICT_CURRICULUMS_REQUEST,
  RECEIVE_DICT_CURRICULUMS_SUCCESS,
  RECEIVE_DICT_CURRICULUMS_ERROR,
  RECEIVE_DICT_STANDARDS_REQUEST,
  RECEIVE_DICT_STANDARDS_SUCCESS,
  RECEIVE_DICT_STANDARDS_ERROR,
  CLEAR_DICT_STANDARDS,
  CLEAR_DICT_ALIGNMENTS,
  UPDATE_DEFAULT_CURRICULUM,
  ADD_DICT_ALIGNMENT,
  SET_ALIGNMENT_FROM_QUESTION,
  REMOVE_DICT_ALINMENT,
  UPDATE_RECENT_STANDARDS,
  UPDATE_DICT_ALIGNMENT
} from "../constants/actions";
import { getFromLocalStorage } from "@edulastic/api/src/utils/Storage";

export const getNewAlignmentState = () => ({
  curriculum: "",
  curriculumId: "",
  subject: "",
  grades: [],
  domains: []
});

const initialItemsState = {
  curriculums: {
    curriculums: [],
    loading: false,
    error: null
  },
  standards: {
    elo: [],
    tlo: [],
    loading: false,
    error: null
  },
  defaultCurriculumName: getFromLocalStorage("defaultCurriculumName"),
  defaultCurriculumId: getFromLocalStorage("defaultCurriculumId"),
  recentStandardsList: getFromLocalStorage("recentStandards") ? JSON.parse(getFromLocalStorage("recentStandards")) : [],
  alignments: [getNewAlignmentState()]
};

const dictionariesReducer = (state = initialItemsState, { type, payload }) => {
  switch (type) {
    case RECEIVE_DICT_CURRICULUMS_REQUEST:
      return {
        ...state,
        curriculums: {
          ...state.curriculums,
          loading: true
        }
      };

    case UPDATE_DEFAULT_CURRICULUM: {
      return {
        ...state,
        defaultCurriculumId: payload.defaultCurriculumId,
        defaultCurriculumName: payload.defaultCurriculumName
      };
    }
    case RECEIVE_DICT_CURRICULUMS_SUCCESS:
      return {
        ...state,
        curriculums: {
          ...state.curriculums,
          curriculums: payload.items,
          loading: false
        }
      };
    case RECEIVE_DICT_CURRICULUMS_ERROR:
      return {
        ...state,
        curriculums: {
          ...state.curriculums,
          loading: false,
          error: payload.error
        }
      };
    case RECEIVE_DICT_STANDARDS_REQUEST:
      return {
        ...state,
        standards: {
          ...state.standards,
          loading: true
        }
      };
    case RECEIVE_DICT_STANDARDS_SUCCESS:
      return {
        ...state,
        standards: {
          ...state.standards,
          elo: payload.elo,
          tlo: payload.tlo,
          loading: false
        }
      };
    case RECEIVE_DICT_STANDARDS_ERROR:
      return {
        ...state,
        standards: {
          ...state.standards,
          loading: false,
          error: payload.error
        }
      };
    case CLEAR_DICT_STANDARDS:
      return {
        ...state,
        standards: {
          ...state.standards,
          elo: [],
          tlo: []
        }
      };
    case CLEAR_DICT_ALIGNMENTS:
      return {
        ...state,
        alignments: [getNewAlignmentState()]
      };
    case SET_ALIGNMENT_FROM_QUESTION:
      const authorAlignments = payload.filter(item => !item.isEquivalentStandard);
      return {
        ...state,
        alignments: authorAlignments
      };
    case ADD_DICT_ALIGNMENT:
      const alignments = [...state.alignments];
      if (!alignments.some(c => c.curriculumId === payload.curriculumId)) alignments.push(payload);
      return {
        ...state,
        alignments
      };
    case REMOVE_DICT_ALINMENT:
      return {
        ...state,
        alignments: state.alignments.filter(item => item.curriculumId !== payload)
      };
    case UPDATE_DICT_ALIGNMENT:
      const editedAlignments = [...state.alignments].map((c, index) => {
        if (index === payload.index) return { ...c, ...payload.changedFields };
        return c;
      });

      return { ...state, alignments: editedAlignments };
    case UPDATE_RECENT_STANDARDS:
      const { recentStandards } = payload;
      return {
        ...state,
        recentStandardsList: recentStandards
      };
    default:
      return state;
  }
};

export default dictionariesReducer;
