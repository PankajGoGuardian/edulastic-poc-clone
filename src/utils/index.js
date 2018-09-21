import { getAssessment } from './api';
import { loadQuestions } from '../actions/questions';
import { loadAssessment } from '../actions/assessment';

export const loadJSON = async (assessmentId, dispatch) => {
  let json = await getAssessment(assessmentId);
  let { _id, name } = json;
  let { questions } = json.questionsApiActivity;
  dispatch(loadAssessment(_id, name));
  dispatch(loadQuestions(questions));
};
