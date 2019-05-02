import { clone, remove } from "lodash";
import {
  RECEIVE_FOLDER_REQUEST,
  RECEIVE_FOLDER_SUCCESS,
  RECEIVE_FOLDER_ERROR,
  RECEIVE_FOLDER_CREATE_REQUEST,
  RECEIVE_FOLDER_CREATE_SUCCESS,
  RECEIVE_FOLDER_CREATE_ERROR,
  DELETE_FOLDER_SUCCESS,
  DELETE_FOLDER_ERROR
} from "../constants/actions";

const initialState = {
  entities: [],
  error: null,
  loading: false,
  creating: false
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
    default:
      return state;
  }
};

export default reducer;
