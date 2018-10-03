import OrderListReducers from '../components/OrderList/reducers';
import questionCommonReducers from './questionCommon';

const assessmentReducers = {
  ...OrderListReducers,
  questionCommon: questionCommonReducers,
};

export default assessmentReducers;
