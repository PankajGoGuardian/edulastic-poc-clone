import OrderListReducers from '../components/OrderList/reducers';
import questions from './questions';
import items from './items';

const assessmentReducers = {
  ...OrderListReducers,
  items,
  assessmentQuestions: questions,
};

export default assessmentReducers;
