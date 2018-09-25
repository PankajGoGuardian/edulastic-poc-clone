/* eslint import/prefer-default-export: 0 */
import { getAssessment } from './api/assessment';
import { loadQuestions } from '../actions/questions';
import { loadAssessment } from '../actions/assessment';

export const loadJSON = async (assessmentId, dispatch) => {
  const json = await getAssessment(assessmentId);
  const { _id, name } = json;
  const { questions } = json.questionsApiActivity;
  dispatch(loadAssessment(_id, name));
  dispatch(loadQuestions(questions));
};
