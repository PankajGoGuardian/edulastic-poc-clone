import { createAction } from "redux-starter-kit";
import undoable, { ActionTypes } from "redux-undo";
import { filterActions } from "redux-ignore";

import { PREVIEW_FEEDBACK_SUCCESS, LOAD_ITEM_PREVIEW_FEEDBACK_SUCCESS } from "../../../../ItemList/ducks";

export const SAVE_PREVIEW_REJECT_WORK = "[testItemPreview] save reject item preview";
export const LOAD_SCRATCH_PAD = "[testItemPreview] load scratchpad item preview";
export const CLEAR_PREVIEW_REJECT_WORK = "[testItemPreview] clear reject item preview";
export const SET_SCRATCHPAD_DATA = "[testItemPreview] set reject item preview";

export const savePreviewRejectAction = createAction(SAVE_PREVIEW_REJECT_WORK);
export const loadScratchPadAction = createAction(LOAD_SCRATCH_PAD);
export const setScratchpadDataAction = createAction(SET_SCRATCHPAD_DATA);

// reducer

const initialState = {
  isRejecting: false
};

function testItemPreviewReducer(state = initialState, { type, payload }) {
  switch (type) {
    case SAVE_PREVIEW_REJECT_WORK:
      return {
        ...state,
        ...payload
      };
    case LOAD_ITEM_PREVIEW_FEEDBACK_SUCCESS:
    case PREVIEW_FEEDBACK_SUCCESS:
      if (payload) {
        const { _id, referrerId, referrerType, data } = payload;
        return {
          ...state,
          scratchpadId: _id,
          referrerType,
          [referrerId]: { scratchpad: data.scratchpad },
          note: data.note
        };
      }
      return {
        ...state
      };
    case SET_SCRATCHPAD_DATA:
      return {
        ...state,
        ...payload
      };
    default:
      return state;
  }
}

export const testItemPreviewAttachment = filterActions(
  undoable(testItemPreviewReducer, {
    limit: 11
  }),
  [
    SAVE_PREVIEW_REJECT_WORK,
    LOAD_ITEM_PREVIEW_FEEDBACK_SUCCESS,
    PREVIEW_FEEDBACK_SUCCESS,
    SET_SCRATCHPAD_DATA,
    ...Object.values(ActionTypes)
  ]
);
