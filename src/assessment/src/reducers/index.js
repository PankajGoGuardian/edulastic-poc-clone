import OrderListReducers from '../components/OrderList/reducers';
import questionCommonReducers from './questionCommon';
import questions from './questions';
import items from './items';

const assessmentReducers = {
  ...OrderListReducers,
  questionCommon: questionCommonReducers,
  items,
  assessmentQuestions: questions,
};

export default assessmentReducers;
