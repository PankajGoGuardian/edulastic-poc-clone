import { SET_CURRENT_ITEM } from '../../constants/actions';

export const setCurrentItemAction = index => ({
  type: SET_CURRENT_ITEM,
  payload: {
    data: index
  }
});
