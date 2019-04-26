import {
  RECEIVE_DICT_CURRICULUMS_REQUEST,
  RECEIVE_DICT_CURRICULUMS_SUCCESS,
  RECEIVE_DICT_CURRICULUMS_ERROR,
  RECEIVE_DICT_STANDARDS_REQUEST,
  RECEIVE_DICT_STANDARDS_SUCCESS,
  RECEIVE_DICT_STANDARDS_ERROR,
  CLEAR_DICT_STANDARDS,
  CLEAR_DICT_ALIGNMENTS,
  ADD_DICT_ALIGNMENT,
  SET_ALIGNMENT_FROM_QUESTION,
  REMOVE_DICT_ALINMENT,
  UPDATE_DICT_ALIGNMENT
} from "../constants/actions";

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
  alignments: []
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
        alignments: []
      };
    case SET_ALIGNMENT_FROM_QUESTION:
      return {
        ...state,
        alignments: payload
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
    default:
      return state;
  }
};

export default dictionariesReducer;
