import { createStore, combineReducers } from 'redux'
import meetingsReducer from "./ducks/messages";
import edulasticReducer from "./ducks/edulastic";

const rootReducer = combineReducers({edulasticReducer,meetingsReducer});
const store = createStore(rootReducer);

export default store;