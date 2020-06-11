import React from "react";
import PropTypes from "prop-types";

import { MathSpan } from "@edulastic/common";
import { response } from "@edulastic/constants";
import { withNamespaces } from "@edulastic/localization";
import { Popover } from "antd";

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
  centerText,
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
              {results[key].map((value, itemId) => {
                const getContent = (inPopover = false) => {
                  const height = inPopover ? "auto" : btnStyle.height;
                  return (
                    <div
                      key={itemId}
                      className="response-btn check-answer showanswer"
                      style={{
                        ...btnStyle,
                        minHeight: height,
                        height: "auto",
                        overflow: inPopover && "auto",
                        maxWidth: inPopover ? response.popoverMaxWidth : response.maxWidth
                      }}
                    >
                      <span className="index" style={{ alignSelf: "stretch" }}>
                        {getStemNumeration(stemNumeration, index)}
                      </span>
                      <span className="text" style={{ justifyContent: centerText && "center" }}>
                        {Array.isArray(groupResponses) && !cleanValue ? getLabel(value) : value}
                      </span>
                    </div>
                  );
                };
                const content = getContent();
                const popoverContent = getContent(true);
                return (
                  <Popover placement="bottomLeft" content={popoverContent}>
                    {content}
                  </Popover>
                );
              })}
            </div>
          ))}
        {!hasGroupResponses &&
          results.map((result, index) => {
            const getContent = (inPopover = false) => {
              const height = inPopover ? "auto" : btnStyle.height;
              return (
                <div
                  key={index}
                  className="response-btn check-answer showanswer"
                  style={{
                    ...btnStyle,
                    minHeight: height,
                    height: "auto",
                    overflow: inPopover && "auto",
                    maxWidth: inPopover ? response.popoverMaxWidth : response.maxWidth
                  }}
                >
                  <span className="index" style={{ alignSelf: "stretch" }}>
                    {getStemNumeration(stemNumeration, index)}
                  </span>
                  <span className="text" style={{ justifyContent: centerText && "center" }}>
                    {Array.isArray(groupResponses) && groupResponses.length > 0 && !cleanValue
                      ? getLabel(result)
                      : result}
                  </span>
                </div>
              );
            };
            const content = getContent();
            const popoverContent = getContent(true);
            return (
              <Popover placement="bottomLeft" content={popoverContent}>
                {content}
              </Popover>
            );
          })}
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
  stemNumeration: PropTypes.string,
  centerText: PropTypes.bool
};

CorrectAnswerBoxLayout.defaultProps = {
  hasGroupResponses: false,
  groupResponses: [],
  fontSize: "13px",
  userAnswers: [],
  cleanValue: false,
  altAnsIndex: 0,
  stemNumeration: "numerical",
  btnStyle: {},
  centerText: false
};

export default React.memo(withNamespaces("assessment")(CorrectAnswerBoxLayout));
