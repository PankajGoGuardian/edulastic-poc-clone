import QuestionEvaluation from "../Base/QuestionEvaluation";
import { QUESTION_ANSWERS } from '../../../constants/others';

class MultipleChoiceEvaluation extends QuestionEvaluation {

  static evaluateResponse(studentResponse) {
    let result = [];
    const answers = JSON.parse(localStorage.getItem(QUESTION_ANSWERS)) || [];
    answers.forEach((answer, index) => {
      console.log('evaluate:', answer, studentResponse[index]);
      const ans = answer === studentResponse[index] || (studentResponse[index] === undefined && !answer);
      result.push(ans);
    });
    return result;
  }

};

export default MultipleChoiceEvaluation;
