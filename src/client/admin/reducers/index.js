import { combineReducers } from "redux";
import tableData from "../SearchDistrictTable/ducks";
import mergeData from "../MergeSyncTable/ducks";
import upgradeData from "../Upgrade/ducks";
import { importTest } from "../../author/ImportTest";

const adminReducers = {
  // make sure all your reducers go inside admin, to have a clean state tree
  admin: combineReducers({
    tableData,
    mergeData,
    upgradeData,
    importTest
  })
};

export default adminReducers;
