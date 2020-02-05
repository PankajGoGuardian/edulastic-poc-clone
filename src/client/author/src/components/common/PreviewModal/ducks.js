import { createSelector } from "reselect";
import { createAction } from "redux-starter-kit";
import { get } from "lodash";
import undoable, { ActionTypes } from "redux-undo";
import { filterActions } from "redux-ignore";

export const SET_QUESTIONS_IN_PASSAGE = "[testItemPreview] set questions to passage";
export const ADD_PASSAGE = "[testItemPreview] add passage to item";
export const SET_ITEM_PREVIEW_DATA = "[testItemPreview] set data";
export const CLEAR_ITEM_PREVIEW = "[testItemPreview] clear item preview";
export const SAVE_PREVIEW_REJECT_WORK = "[testItemPreview] save reject item preview";
export const LOAD_SCRATCH_PAD = "[testItemPreview] load scratchpad item preview";
export const CLEAR_PREVIEW_REJECT_WORK = "[testItemPreview] clear reject item preview";

import { PREVIEW_FEEDBACK_SUCCESS, LOAD_ITEM_PREVIEW_FEEDBACK_SUCCESS } from "../../../../ItemList/ducks";

export const setQuestionsForPassageAction = createAction(SET_QUESTIONS_IN_PASSAGE);
export const addPassageAction = createAction(ADD_PASSAGE);
export const clearPreviewAction = createAction(CLEAR_ITEM_PREVIEW);
export const setPrevewItemAction = createAction(SET_ITEM_PREVIEW_DATA);
export const savePreviewRejectAction = createAction(SAVE_PREVIEW_REJECT_WORK);
export const loadScratchPad = createAction(LOAD_SCRATCH_PAD);

export const stateSelector = state => state.testItemPreview;
export const getPassageSelector = createSelector(
  stateSelector,
  state => state.passage
);

export const getItemDetailSelectorForPreview = (state, id, page) => {
  let testItems = [];
  const testItemPreview = get(state, "testItemPreview.item", {});
  if (testItemPreview && testItemPreview.data) {
    return get(state, "testItemPreview.item");
  }
  if (page === "addItems" || page === "itemList") {
    testItems = get(state, "testsAddItems.items", []);
  } else if (page === "review") {
    testItems = state.tests.entity.itemGroups.flatMap(itemGroup => itemGroup.items || []) || [];
  } else {
    console.warn("unknown page type ", page);
  }
  const item = testItems.find(x => x._id === id);
  return item || undefined;
};

// reducer

const initialState = {
  item: null,
  passage: null,
  previewData: {},
  isRejecting: false
};

function testItemPreviewReducer(state = initialState, { type, payload }) {
  switch (type) {
    case SET_QUESTIONS_IN_PASSAGE: {
      return {
        ...state,
        item: {
          ...payload,
          data: {
            ...state.item.data,
            questions: payload.data.questions
          }
        }
      };
    }
    case ADD_PASSAGE: {
      return { ...state, item: { ...state.item, passageId: payload._id }, passage: payload };
    }
    case SET_ITEM_PREVIEW_DATA:
      return { ...state, item: payload };
    case CLEAR_ITEM_PREVIEW:
      return initialState;
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
    default:
      return state;
  }
}

export const reducer = filterActions(
  undoable(testItemPreviewReducer, {
    limit: 11
  }),
  [
    SET_QUESTIONS_IN_PASSAGE,
    ADD_PASSAGE,
    SET_ITEM_PREVIEW_DATA,
    CLEAR_ITEM_PREVIEW,
    SAVE_PREVIEW_REJECT_WORK,
    LOAD_ITEM_PREVIEW_FEEDBACK_SUCCESS,
    PREVIEW_FEEDBACK_SUCCESS,
    ...Object.values(ActionTypes)
  ]
);
