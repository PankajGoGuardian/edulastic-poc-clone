import { combineReducers } from "redux";
import tableData from "../ducks";

const adminReducers = {
  // make sure all your reducers go inside admin, to have a clean state tree
  admin: combineReducers({
    tableData
  })
};

export default adminReducers;
