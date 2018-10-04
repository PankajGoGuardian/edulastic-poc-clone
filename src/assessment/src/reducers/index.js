import OrderListReducers from '../components/OrderList/reducers';
import questionCommonReducers from './questionCommon';
import items from './items';

const assessmentReducers = {
  ...OrderListReducers,
  questionCommon: questionCommonReducers,
  items,
};

export default assessmentReducers;
