import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { white } from "@edulastic/colors";
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
                    <AnswerBoxItem
                      key={itemId}
                      style={{
                        ...btnStyle,
                        height,
                        overflow: inPopover && "auto",
                        minHeight: btnStyle.height,
                        maxWidth: inPopover ? response.popoverMaxWidth : response.maxWidth
                      }}
                    >
                      <span className="index" style={{ alignSelf: "stretch" }}>
                        {getStemNumeration(stemNumeration, index)}
                      </span>
                      <span className="text" style={{ justifyContent: centerText && "center" }}>
                        {Array.isArray(groupResponses) && !cleanValue ? getLabel(value) : value}
                      </span>
                    </AnswerBoxItem>
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
                <AnswerBoxItem
                  key={index}
                  style={{
                    ...btnStyle,
                    height,
                    minHeight: btnStyle.height,
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
                </AnswerBoxItem>
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

const AnswerBoxItem = styled.div`
  display: inline-flex;
  min-width: 135px;
  align-items: center;
  background: ${white};
  margin-right: 5px;
  border: 1px solid #b6b6cc;
  border-radius: 4px;

  & .index {
    width: 32px;
    background: #a7a7a7;
    color: ${white};
    border-radius: 4px 0px 0px 4px;
    font-size: 14px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  & .text {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
