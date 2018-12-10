import {
  RECEIVE_QUESTION_REQUEST,
  RECEIVE_QUESTION_SUCCESS,
  RECEIVE_QUESTION_ERROR,
  SAVE_QUESTION_REQUEST,
  SAVE_QUESTION_SUCCESS,
  SAVE_QUESTION_ERROR,
  SET_QUESTION_DATA,
  SET_QUESTION_ALIGNMENT_ROW,
  SET_QUESTION,
  SET_QUESTION_ALIGNMENT_ROW_STANDARDS,
  SET_QUESTION_ALIGNMENT_ADD_ROW
} from '../constants/actions';

const initialState = {
  entity: null,
  loading: false,
  saving: false,
  error: null,
  saveError: null
};

const question = (state = initialState, { type, payload }) => {
  switch (type) {
    case RECEIVE_QUESTION_REQUEST:
      return {
        ...state,
        loading: true
      };
    case RECEIVE_QUESTION_SUCCESS:
      return {
        ...state,
        loading: false,
        entity: payload.entity
      };
    case RECEIVE_QUESTION_ERROR:
      return {
        ...state,
        loading: false,
        error: payload.error
      };

    case SAVE_QUESTION_REQUEST:
      return {
        ...state,
        saving: true
      };
    case SAVE_QUESTION_SUCCESS:
      return {
        ...state,
        saving: false
      };
    case SAVE_QUESTION_ERROR:
      return {
        ...state,
        saving: false,
        saveError: payload.error
      };

    case SET_QUESTION_DATA:
      return {
        ...state,
        entity: { ...state.entity, data: payload.data }
      };
    case SET_QUESTION_ALIGNMENT_ROW: {
      const { index, alignmentRow } = payload;
      const newAlignment = [...state.entity.alignment];
      newAlignment[index] = { ...alignmentRow, alignmentStandards: [] };
      return {
        ...state,
        entity: {
          ...state.entity,
          alignment: newAlignment
        }
      };
    }
    case SET_QUESTION_ALIGNMENT_ROW_STANDARDS: {
      const { index, alignmentStandards } = payload;
      const newAlignment = [...state.entity.alignment];
      newAlignment[index] = { ...state.entity.alignment[index], alignmentStandards };
      return {
        ...state,
        entity: {
          ...state.entity,
          alignment: newAlignment
        }
      };
    }
    case SET_QUESTION_ALIGNMENT_ADD_ROW: {
      const newAlignment = [...state.entity.alignment];
      newAlignment.push({ alignmentStandards: [] });
      return {
        ...state,
        entity: {
          ...state.entity,
          alignment: newAlignment
        }
      };
    }
    case SET_QUESTION:
      return {
        ...state,
        entity: {
          data: payload.data
        }
      };

    default:
      return state;
  }
};

export default question;
