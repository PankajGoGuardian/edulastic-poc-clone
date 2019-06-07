import React from "react";
import PropTypes from "prop-types";

// eslint-disable-next-line max-len
const CorrectAnswerBoxLayout = ({ hasGroupResponses, fontSize, userAnswers, groupResponses, altAnswers }) => {
  let results;
  if (hasGroupResponses) {
    results = {};
    userAnswers.forEach(userAnswer => {
      if (results[userAnswer.group] === undefined) {
        results[userAnswer.group] = [];
      }
      results[userAnswer.group].push(userAnswer.data);
    });
  } else {
    if (altAnswers && altAnswers.length > 0) {
      userAnswers = userAnswers.map((ans, index) => {
        const final = [ans];
        for (const altAnswer of altAnswers) {
          const { value } = altAnswer;
          if (value[index] && value[index] !== "") {
            final.push(value[index]);
          }
        }
        return final;
      });
    }
    results = userAnswers;
  }
  return (
    <div className="correctanswer-box" style={{ padding: 16, fontSize }}>
      <h2 style={{ fontSize: 20 }}>Correct Answer</h2>
      <div>
        {hasGroupResponses &&
          Object.keys(results).map((key, index) => (
            <div key={index}>
              <h3>{groupResponses[key] && groupResponses[key].title}</h3>
              {results[key].map(
                (value, itemId) =>
                  value && (
                    <div key={itemId} className="response-btn check-answer showanswer">
                      <span className="index">{index + 1}</span>
                      <span className="text">{value}</span>
                    </div>
                  )
              )}
            </div>
          ))}
        {!hasGroupResponses &&
          results.map((result, index) => (
            <div key={index} className="response-btn check-answer showanswer">
              <span className="index">{index + 1}</span>
              <span className="text">{typeof result === "string" ? result : result.join(", ")}</span>
            </div>
          ))}
      </div>
    </div>
  );
};

CorrectAnswerBoxLayout.propTypes = {
  hasGroupResponses: PropTypes.bool,
  fontSize: PropTypes.string,
  userAnswers: PropTypes.array,
  groupResponses: PropTypes.array,
  altAnswers: PropTypes.array
};

CorrectAnswerBoxLayout.defaultProps = {
  hasGroupResponses: false,
  groupResponses: [],
  fontSize: "13px",
  userAnswers: [],
  altAnswers: []
};

export default React.memo(CorrectAnswerBoxLayout);
