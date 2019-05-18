import { sagas } from "../SearchDistrictTable/ducks";
import { sagas as mergeSagas } from "../MergeSyncTable/ducks";
import { sagas as upgradeSagas } from "../Upgrade/ducks";

export default [...sagas, ...mergeSagas, ...upgradeSagas];
