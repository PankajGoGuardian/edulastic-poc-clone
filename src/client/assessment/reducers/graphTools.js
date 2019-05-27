import { isEqualWith, cloneDeep, isEqual } from "lodash";
import { SET_ELEMENTS_STASH, SET_STASH_INDEX } from "../constants/actions";

const initialState = {
  stashIndex: {},
  stash: {}
};

const customizer = (objValue, othValue) => {
  if (!objValue && !othValue) {
    return true;
  }
  if (objValue.length === 0 && othValue.length === 0) {
    return true;
  }
  if (objValue.length !== othValue.length) {
    return false;
  }

  for (let i = 0; i < objValue.length; i++) {
    const objItem = cloneDeep(objValue[i]);
    const othItem = cloneDeep(othValue[i]);
    delete objItem.id;
    delete othItem.id;
    delete objItem.subElementsIds;
    delete othItem.subElementsIds;
    if (!isEqual(objItem, othItem)) {
      return false;
    }
  }
  return true;
};

const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_ELEMENTS_STASH: {
      const calculatedStash = cloneDeep(state.stash);
      const calculatedIndex = cloneDeep(state.stashIndex);

      if ((calculatedStash[payload.id] && calculatedStash[payload.id].length === 0) || !calculatedStash[payload.id]) {
        calculatedStash[payload.id] = [payload.data];
      } else if (
        !isEqualWith(calculatedStash[payload.id][calculatedStash[payload.id].length - 1], payload.data, customizer)
      ) {
        calculatedStash[payload.id] = calculatedStash[payload.id].concat([payload.data]);
      }

      calculatedIndex[payload.id] = calculatedStash[payload.id].length - 1;

      return {
        ...state,
        stashIndex: calculatedIndex,
        stash: calculatedStash
      };
    }
    case SET_STASH_INDEX: {
      const newIndex = cloneDeep(state.stashIndex);
      newIndex[payload.id] = payload.data;

      return {
        ...state,
        stashIndex: newIndex
      };
    }
    default:
      return state;
  }
};

export default reducer;
