import {
  CREATE_TEST_ITEM_REQUEST,
  CREATE_TEST_ITEM_SUCCESS,
  CREATE_TEST_ITEM_ERROR,
  TOGGLE_CREATE_ITEM_MODAL
} from "../constants/actions";

const initialState = {
  item: [],
  createError: null,
  creating: false,
  createItemModalVisible: false,
  modalItemId: undefined
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case CREATE_TEST_ITEM_REQUEST:
      return { ...state, creating: true };
    case CREATE_TEST_ITEM_SUCCESS:
      return {
        ...state,
        creating: false,
        item: payload.item
      };
    case CREATE_TEST_ITEM_ERROR:
      return { ...state, creating: false, createError: payload.error };
    case TOGGLE_CREATE_ITEM_MODAL:
      return {
        ...state,
        createItemModalVisible: payload.modalVisible,
        modalItemId: payload.itemId
      };
    default:
      return state;
  }
};
