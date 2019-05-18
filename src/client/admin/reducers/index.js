import { combineReducers } from "redux";
import tableData from "../SearchDistrictTable/ducks";
import mergeData from "../MergeSyncTable/ducks";
import upgradeData from "../Upgrade/ducks";

const adminReducers = {
  // make sure all your reducers go inside admin, to have a clean state tree
  admin: combineReducers({
    tableData,
    mergeData,
    upgradeData
  })
};

export default adminReducers;
