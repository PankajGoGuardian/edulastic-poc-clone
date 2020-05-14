import { createAction } from "redux-starter-kit";
import { STORE_OPTIONS, CLEAR_OPTIONS } from "../constants/actions";

export const storeOrderInRedux = createAction(STORE_OPTIONS);
export const clearOrderOfOptionsInStore = createAction(CLEAR_OPTIONS);
