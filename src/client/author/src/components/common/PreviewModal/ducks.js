import { createSelector } from "reselect";
import { createAction } from "redux-starter-kit";
import { get } from "lodash";
import { markQuestionLabel } from "../../../../../assessment/Transformer";

export const SET_QUESTIONS_IN_PASSAGE = "[testItemPreview] set questions to passage";
export const ADD_PASSAGE = "[testItemPreview] add passage to item";
export const SET_ITEM_PREVIEW_DATA = "[testItemPreview] set data";
export const CLEAR_ITEM_PREVIEW = "[testItemPreview] clear item preview";

export const setQuestionsForPassageAction = createAction(SET_QUESTIONS_IN_PASSAGE);
export const addPassageAction = createAction(ADD_PASSAGE);
export const clearPreviewAction = createAction(CLEAR_ITEM_PREVIEW);
export const setPrevewItemAction = createAction(SET_ITEM_PREVIEW_DATA);

export const stateSelector = state => state.testItemPreview;
export const getPassageSelector = createSelector(
  stateSelector,
  state => state.passage
);

export const getItemDetailSelectorForPreview = (state, id, page) => {
  let testItems = [];
  const testItemPreview = get(state, "testItemPreview.item", {});
  if (testItemPreview && testItemPreview.data) {
    console.log("testItemPreview");
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
  if (item?.multipartItem) {
    // markQuestionLabel([item]);
  }
  return item || undefined;
};

// reducer

const initialState = {
  item: null,
  passage: null
};

export function reducer(state = initialState, { type, payload }) {
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
    default:
      return state;
  }
}
