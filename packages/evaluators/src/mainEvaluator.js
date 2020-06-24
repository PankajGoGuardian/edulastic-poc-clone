import { ScoringType } from "./const/scoring";
import countPartialMatchScores from "./helpers/countPartialMatchScores";
import partialMatchTemplate from "./helpers/partialMatchTemplate";
import exactMatchTemplate from "./helpers/exactMatchTemplate";
import countExactMatchScores from "./helpers/countExactMatchScores";

const evaluator = (evaluatorType, qType = "") => ({ userResponse = [], validation }) => {
  const { validResponse, altResponses = [], scoringType } = validation;
  const answers = [validResponse, ...altResponses];
  switch (scoringType) {
    case ScoringType.EXACT_MATCH:
      return exactMatchTemplate(countExactMatchScores(evaluatorType), {
        userResponse,
        answers,
        validation,
        qType
      });
    case ScoringType.PARTIAL_MATCH:
    case ScoringType.PARTIAL_MATCH_V2:
    default:
      return partialMatchTemplate(countPartialMatchScores(evaluatorType), {
        userResponse,
        answers,
        validation,
        qType
      });
  }
};

export default evaluator;
