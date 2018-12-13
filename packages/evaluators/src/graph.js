import comparison from './graphs-comparison';

const evaluator = ({ userResponse, validation }) => {
  let result = {};

  let correct = false;
  let compareResult = comparison.checkAnswer(validation, userResponse);
  correct = compareResult.commonResult;
  if (!correct) {
    if (validation.alt_responses && validation.alt_responses.length > 0) {
      for (let i = 0; i < validation.alt_responses.length; i++) {
        /** for compatibility with graphs-comparison's checkAnswer method */
        const tmpValidation = {};
        tmpValidation.valid_response = validation.alt_responses[i];
        const altResponseCompareResult = comparison.checkAnswer(tmpValidation, userResponse);
        correct = altResponseCompareResult.commonResult;
        if (correct) {
          compareResult = altResponseCompareResult;
          break;
        }
      }
    }
  }

  result = compareResult;

  return result;
};

export default evaluator;
