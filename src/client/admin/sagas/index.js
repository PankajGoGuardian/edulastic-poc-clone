import { sagas } from "../SearchDistrictTable/ducks";
import { sagas as mergeSagas } from "../MergeSyncTable/ducks";

export default [...sagas, ...mergeSagas];
