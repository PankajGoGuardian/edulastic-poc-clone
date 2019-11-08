import React from "react";
import PropTypes from "prop-types";

import { MathSpan } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";

import { getStemNumeration } from "../../utils/helpers";
import { StyledCorrectAnswerbox } from "./styled/StyledCorrectAnswerbox";
import { CorrectAnswerTitle } from "./styled/CorrectAnswerTitle";

const CorrectAnswerBoxLayout = ({
  hasGroupResponses,
  fontSize,
  userAnswers,
  altAnsIndex,
  cleanValue,
  groupResponses,
  btnStyle,
  stemNumeration,
  alignText = false,
  t
}) => {
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
    results = userAnswers;
  }

  const getLabel = value => {
    if (hasGroupResponses) {
      const Group = groupResponses.find(group => group.options.find(option => option.value === value));
      if (Group) {
        const Item = Group.options.find(option => option.value === value);
        if (Item) {
          return <MathSpan dangerouslySetInnerHTML={{ __html: Item.label }} />;
        }
      }
    } else {
      const Item = groupResponses.find(option => option.value === value);
      if (Item) {
        return <MathSpan dangerouslySetInnerHTML={{ __html: Item.label }} />;
      }
    }
  };

  return (
    <StyledCorrectAnswerbox fontSize={fontSize}>
      <CorrectAnswerTitle>
        {altAnsIndex ? `${t("component.cloze.altAnswers")} ${altAnsIndex}` : t("component.cloze.correctAnswer")}
      </CorrectAnswerTitle>
      <div>
        {hasGroupResponses &&
          Object.keys(results).map((key, index) => (
            <div key={index}>
              <h3>{groupResponses[key] && groupResponses[key].title}</h3>
              {results[key].map((value, itemId) => (
                <div key={itemId} className="response-btn check-answer showanswer" style={btnStyle}>
                  <span className="index">{getStemNumeration(stemNumeration, index)}</span>
                  <span className="text" style={{ justifyContent: alignText && "center" }}>
                    {Array.isArray(groupResponses) && !cleanValue ? getLabel(value) : value}
                  </span>
                </div>
              ))}
            </div>
          ))}
        {!hasGroupResponses &&
          results.map((result, index) => (
            <div key={index} className="response-btn check-answer showanswer" style={btnStyle}>
              <span className="index">{getStemNumeration(stemNumeration, index)}</span>
              <span className="text" style={{ justifyContent: alignText && "center" }}>
                {Array.isArray(groupResponses) && groupResponses.length > 0 && !cleanValue ? getLabel(result) : result}
              </span>
            </div>
          ))}
      </div>
    </StyledCorrectAnswerbox>
  );
};

CorrectAnswerBoxLayout.propTypes = {
  hasGroupResponses: PropTypes.bool,
  fontSize: PropTypes.string,
  userAnswers: PropTypes.array,
  groupResponses: PropTypes.array,
  t: PropTypes.func.isRequired,
  cleanValue: PropTypes.bool,
  btnStyle: PropTypes.object,
  altAnsIndex: PropTypes.number,
  stemNumeration: PropTypes.string
};

CorrectAnswerBoxLayout.defaultProps = {
  hasGroupResponses: false,
  groupResponses: [],
  fontSize: "13px",
  userAnswers: [],
  cleanValue: false,
  altAnsIndex: 0,
  stemNumeration: "numerical",
  btnStyle: {}
};

export default React.memo(withNamespaces("assessment")(CorrectAnswerBoxLayout));
