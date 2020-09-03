import { createStore, combineReducers } from 'redux'
import meetingsReducer from "./ducks/messages";
import edulasticReducer from "./ducks/edulastic";
import settingsReducer from "./ducks/settings";

const rootReducer = combineReducers({edulasticReducer,meetingsReducer, settingsReducer});
const store = createStore(rootReducer);

export default store;