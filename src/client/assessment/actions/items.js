import {
  RECEIVE_ITEMS_REQUEST,
  RECEIVE_ITEM_REQUEST,
  CREATE_ITEM_REQUEST,
  UPDATE_ITEM_REQUEST,
  GOTO_ITEM,
  SAVE_USER_RESPONSE,
  LOAD_USER_RESPONSE,
  SAVE_TESTLET_USER_RESPONSE,
} from '../constants/actions'

export const receiveItemsAction = ({ page, limit, search }) => ({
  type: RECEIVE_ITEMS_REQUEST,
  payload: { page, limit, search },
})

export const receiveItemByIdAction = (id) => ({
  type: RECEIVE_ITEM_REQUEST,
  payload: { id },
})

export const createItemAction = (payload) => ({
  type: CREATE_ITEM_REQUEST,
  payload: { payload },
})

export const updateItemByIdAction = (payload) => ({
  type: UPDATE_ITEM_REQUEST,
  payload: { payload },
})

export const gotoItem = (item) => ({
  type: GOTO_ITEM,
  payload: {
    item,
  },
})

export const saveUserResponse = (
  item,
  timeSpent,
  autoSave = false,
  groupId,
  payload
) => ({
  type: SAVE_USER_RESPONSE,
  payload: {
    ...payload,
    timeSpent,
    itemId: item,
    autoSave,
    groupId,
  },
})

// NOTE we should use separate an action to store testlet user response
export const saveTestletUserResponse = (
  item,
  timeSpent,
  autoSave = false,
  groupId,
  extData,
  payload
) => ({
  type: SAVE_TESTLET_USER_RESPONSE,
  payload: {
    ...payload,
    timeSpent,
    itemId: item,
    autoSave,
    groupId,
    extData,
  },
})

export const loadUserResponse = (item) => ({
  type: LOAD_USER_RESPONSE,
  payload: {
    itemId: item,
  },
})
