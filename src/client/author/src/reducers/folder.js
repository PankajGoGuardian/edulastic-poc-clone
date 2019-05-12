import { clone, remove, findIndex } from "lodash";
import {
  RECEIVE_FOLDER_REQUEST,
  RECEIVE_FOLDER_SUCCESS,
  RECEIVE_FOLDER_ERROR,
  RECEIVE_FOLDER_CREATE_REQUEST,
  RECEIVE_FOLDER_CREATE_SUCCESS,
  RECEIVE_FOLDER_CREATE_ERROR,
  DELETE_FOLDER_SUCCESS,
  DELETE_FOLDER_ERROR,
  RENAME_FOLDER_SUCCESS,
  RENAME_FOLDER_ERROR,
  ADD_MOVE_FOLDER_SUCCESS,
  SET_FOLDER,
  CLEAR_FOLDER
} from "../constants/actions";

const initialState = {
  entities: [],
  error: null,
  loading: false,
  creating: false,
  entity: {}
};

const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case RECEIVE_FOLDER_REQUEST:
      return {
        ...state,
        loading: true
      };
    case RECEIVE_FOLDER_SUCCESS:
      return {
        ...state,
        loading: false,
        entities: payload.entities
      };
    case RECEIVE_FOLDER_ERROR:
      return {
        ...state,
        loading: false,
        error: payload.error
      };
    case RECEIVE_FOLDER_CREATE_REQUEST:
      return {
        ...state,
        creating: true
      };
    case RECEIVE_FOLDER_CREATE_SUCCESS: {
      const { entities } = state;
      entities.push(payload.entity);
      return {
        ...state,
        entities: clone(entities),
        creating: false
      };
    }
    case RECEIVE_FOLDER_CREATE_ERROR:
      return {
        ...state,
        creating: false,
        error: payload.error
      };
    case ADD_MOVE_FOLDER_SUCCESS: {
      if (payload) {
        const { _id } = payload.result;
        const { entities } = state;
        const index = findIndex(entities, entity => entity._id === _id);
        if (index !== -1) {
          entities.splice(index, 1, payload.result);
        }
        return {
          ...state,
          entities: clone(entities)
        };
      }
      return state;
    }
    case DELETE_FOLDER_SUCCESS: {
      const { folderId } = payload;
      const { entities } = state;
      remove(entities, entity => entity._id === folderId);
      return {
        ...state,
        entities: clone(entities)
      };
    }
    case DELETE_FOLDER_ERROR:
      return {
        ...state,
        error: payload.error
      };
    case RENAME_FOLDER_SUCCESS: {
      if (payload) {
        const { entities } = state;
        const index = findIndex(entities, entity => entity._id === payload._id);
        if (index !== -1) {
          entities.splice(index, 1, payload);
        }
        return {
          ...state,
          entities: clone(entities)
        };
      }
      return state;
    }
    case RENAME_FOLDER_ERROR:
      return {
        ...state,
        error: payload.error
      };
    case SET_FOLDER:
      return {
        ...state,
        entity: payload
      };

    case CLEAR_FOLDER:
      return {
        ...state,
        entity: {}
      };
    default:
      return state;
  }
};

export default reducer;
