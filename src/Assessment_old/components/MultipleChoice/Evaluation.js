import QuestionEvaluation from '../Base/QuestionEvaluation';
import { QUESTION_ANSWERS } from '../../constants/others';

class MultipleChoiceEvaluation extends QuestionEvaluation {
  static evaluateResponse(studentResponse) {
    const result = [];
    const answers = JSON.parse(localStorage.getItem(QUESTION_ANSWERS)) || [];
    answers.forEach((answer, index) => {
      console.log('evaluate:', answer, studentResponse[index]);
      // eslint-disable-next-line
      const ans = answer === studentResponse[index] === true || (studentResponse[index] === undefined && !answer);
      result.push(ans);
    });
    return result;
  }
}

export default MultipleChoiceEvaluation;
