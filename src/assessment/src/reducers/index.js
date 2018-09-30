import itemsReducer from './items';
import OrderListReducers from '../components/OrderList/reducers';


const assessmentReducers = {
  itemsReducer,
  ...OrderListReducers,
};

export default assessmentReducers;
