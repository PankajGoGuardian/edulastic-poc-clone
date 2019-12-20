import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { withNamespaces } from "@edulastic/localization";
import { Popover } from "antd";

import { getStemNumeration } from "../../../utils/helpers";

import { AnswerBox } from "../styled/AnswerBox";
import { IndexBox } from "../styled/IndexBox";
import { AnswerContent } from "../styled/AnswerContent";

const CorrectAnswerBoxLayout = ({ fontSize, userAnswers, altIndex, stemNumeration, t }) => (
  <div className="correctanswer-box" style={{ padding: 16, fontSize }}>
    <CorrectAnswerTitle>
      {altIndex ? `${t("component.cloze.altAnswers")} ${altIndex}` : t("component.cloze.correctAnswer")}
    </CorrectAnswerTitle>
    <Answers>
      {userAnswers
        .sort((a, b) => a.index - b.index)
        .map(answer => {
          const content = (
            <AnswerContent
              style={{
                whiteSpace: "normal",
                minWidth: 70,
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
              dangerouslySetInnerHTML={{ __html: answer.value }}
            />
          );
          return (
            <AnswerBox key={answer.id}>
              <IndexBox>{getStemNumeration(stemNumeration, answer.index)}</IndexBox>
              <Popover content={content}>{content}</Popover>
            </AnswerBox>
          );
        })}
    </Answers>
  </div>
);

CorrectAnswerBoxLayout.propTypes = {
  fontSize: PropTypes.string,
  userAnswers: PropTypes.array,
  altIndex: PropTypes.array,
  stemNumeration: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired
};

CorrectAnswerBoxLayout.defaultProps = {
  fontSize: "13px",
  userAnswers: [],
  altIndex: 0
};

export default React.memo(withNamespaces("assessment")(CorrectAnswerBoxLayout));

const CorrectAnswerTitle = styled.h2`
  font-size: ${({ theme }) => theme.correctAnswerBoxLayout.titleFontSize};
`;

const Answers = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
