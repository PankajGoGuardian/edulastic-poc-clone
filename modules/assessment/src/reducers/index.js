import { combineReducers } from 'redux';

import questions from './questions';
import items from './items';
import MultiChoiceReducers from '../components/MultipleChoice/reducers';
import OrderListReducers from '../components/OrderList/reducers';


const rootReducer = combineReducers({
  questions,
  items,
  MultiChoiceReducers,
  OrderListReducers,
});

export default rootReducer;
