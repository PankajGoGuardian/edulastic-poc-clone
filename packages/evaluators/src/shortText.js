import { ScoringType } from "./const/scoring";

// exact-match evaluator
const exactMatchEvaluator = (
  userResponse,
  validAnswer,
  altAnswers,
  { automarkable, minScoreIfAttempted, maxScore }
) => {
  let score = 0;

  const text = userResponse;

  const { value: validValue, score: validScore, matchingRule } = validAnswer;

  let mScore = validScore;

  let evaluation = false;

  if ((validValue || "").trim() === (text || "").trim()) {
    evaluation = true;
    score = validScore;
  }

  if (matchingRule === ScoringType.CONTAINS && text && text.toLowerCase().includes(validValue.toLowerCase())) {
    evaluation = true;
    if (score === 0) {
      score = validScore;
    }
  }

  altAnswers.forEach(ite => {
    const { value: altValue, score: altScore, matchingRule: altMatch } = ite;

    if ((altValue || "").trim() === (text || "").trim()) {
      evaluation = true;
      if (score === 0) {
        score = altScore;
      }
    }

    if (altMatch === ScoringType.CONTAINS && text && text.toLowerCase().includes(altValue.toLowerCase())) {
      evaluation = true;
      if (score === 0) {
        score = altScore;
      }
    }

    mScore = Math.max(mScore, altScore);
  });

  if (automarkable) {
    if (minScoreIfAttempted) {
      mScore = Math.max(mScore, minScoreIfAttempted);
      score = Math.max(minScoreIfAttempted, score);
    }
  } else if (maxScore) {
    mScore = Math.max(mScore, maxScore);
  }

  return {
    score,
    maxScore: mScore,
    evaluation
  };
};

const evaluator = ({ userResponse, validation }) => {
  const { validResponse, altResponses, scoringType } = validation;

  switch (scoringType) {
    case ScoringType.EXACT_MATCH:
    default:
      return exactMatchEvaluator(userResponse, validResponse, altResponses, validation);
  }
};

export default evaluator;
