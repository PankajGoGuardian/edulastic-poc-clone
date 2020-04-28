import {
  RECEIVE_STUDENT_RESPONSE_REQUEST,
  RECEIVE_STUDENT_RESPONSE_SUCCESS,
  RECEIVE_STUDENT_RESPONSE_ERROR,
  UPDATE_OVERALL_FEEDBACK,
  RESPONSE_ENTRY_SCORE_SUCCESS
} from "../constants/actions";
import produce from "immer";

const initialState = {
  data: {},
  error: null,
  loading: false,
  byStudentId: {}
};

const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case RECEIVE_STUDENT_RESPONSE_REQUEST:
      return { ...state, loading: true };
    case RECEIVE_STUDENT_RESPONSE_SUCCESS:
      const byStudentId = { ...state.byStudentId };
      byStudentId[payload.testActivity.userId] = payload;
      return {
        ...state,
        loading: false,
        data: payload,
        byStudentId
      };
    case RESPONSE_ENTRY_SCORE_SUCCESS:
      const { testActivity, questionActivities } = payload;
      if (state.data?.testActivity?._id !== testActivity?._id) {
        return state;
      }
      return produce(state, _state => {
        _state.data.testActivity = testActivity;
        for (const qAct of questionActivities) {
          const { testActivityId, score, maxScore, ...questionItem } = qAct;
          const qActPayload = _state.data.questionActivities.find(({ qid }) => qAct.qid === qid);
          if (qActPayload) {
            Object.assign(qActPayload, { ...questionItem, score });
          } else {
            console.warn("Payload qAct.id is missing in the state qAct.id", qAct);
          }
        }
      });
    case RECEIVE_STUDENT_RESPONSE_ERROR:
      return { ...state, loading: false, error: payload.error };
    case UPDATE_OVERALL_FEEDBACK:
      return {
        ...state,
        data: {
          ...state.data,
          testActivity: {
            ...state.data.testActivity,
            feedback: payload
          }
        }
      };
    default:
      return state;
  }
};

export default reducer;
