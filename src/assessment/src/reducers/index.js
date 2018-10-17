import OrderListReducers from '../components/OrderList/reducers';
import questions from './questions';
import items from './items';
import test from './test';

const assessmentReducers = {
  ...OrderListReducers,
  items,
  test,
  assessmentQuestions: questions
};

export default assessmentReducers;
