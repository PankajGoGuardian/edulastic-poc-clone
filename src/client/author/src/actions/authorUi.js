import { createAction } from "redux-starter-kit";
import { ADD_LOADING_COMPONENT, REMOVE_LOADING_COMPONENT } from "../constants/actions";

export const addLoadingComponentAction = createAction(ADD_LOADING_COMPONENT);
export const removeLoadingComponentAction = createAction(REMOVE_LOADING_COMPONENT);