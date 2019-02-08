import {
  RECEIVE_TESTACTIVITY_REQUEST,
  RECEIVE_TESTACTIVITY_SUCCESS,
  RECEIVE_TESTACTIVITY_ERROR
} from '../constants/actions';

import {createAction} from 'redux-starter-kit';
import {produce} from 'immer';


export const REALTIME_GRADEBOOK_TEST_ACTIVITY_ADD = '[gradebook] realtime test activity add';
export const REALTIME_GRADEBOOK_TEST_ITEM_ADD = '[gradebook] realtime test item add';
export const realtimeGradebookActivityAddAction =  createAction(REALTIME_GRADEBOOK_TEST_ACTIVITY_ADD);
export const realtimeGradebookTestItemAddAction =  createAction(REALTIME_GRADEBOOK_TEST_ITEM_ADD);

const initialState = {
  entities: [],
  error: null,
  loading: false
};

const reducer = (state = initialState, { type, payload }) => {
  let nextState;
  switch (type) {
    case RECEIVE_TESTACTIVITY_REQUEST:
      return { ...state, loading: true };
    case RECEIVE_TESTACTIVITY_SUCCESS:
      return {
        ...state,
        loading: false,
        entities: payload.entities
      };
    case REALTIME_GRADEBOOK_TEST_ACTIVITY_ADD:
      let entity = payload;
      entity.present = true;
      entity.graded = false;
      entity.maxScore  = 0;
      entity.score = 0;
      entity.testItems = [];
      nextState = produce(state, _st => {
        const index = _st.entities.findIndex(x => x.studentId === entity.studentId);
        console.log('taId student index',index);
        if(index != -1){
          _st.entities[index] = entity;
        } else {
          _st.entities.push(entity);
        }
      });
      return nextState;
    
    case REALTIME_GRADEBOOK_TEST_ITEM_ADD:
       nextState = produce(state,_st => {
        const {testActivityId,score,maxScore,...testItem} = payload;
        const entityIndex = _st.entities.findIndex(x => x.testActivityId === testActivityId);
        if(entityIndex != -1){
          console.log('entityIndex',entityIndex);
          const itemIndex = _st.entities[entityIndex].testItems.findIndex(x => x._id==testItem._id);
          if(itemIndex == -1){
            _st.entities[entityIndex].testItems.push(testItem);
          } else {
            _st.entities[entityIndex].testItems[itemIndex]= testItem;
          }
          if(score){
            _st.entities[entityIndex].score += score;
          }
          if(maxScore){
            _st.entities[entityIndex].maxScore += maxScore;
          }
        } 
      });
      return nextState;
    case RECEIVE_TESTACTIVITY_ERROR:
      return { ...state, loading: false, error: payload.error };
    default:
      return state;
  }
};

export default reducer;
