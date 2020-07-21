import React, { useState } from "react";
import PropTypes from "prop-types";
import { Popover } from "antd";
import styled from "styled-components";
import { greyishBorder } from "@edulastic/colors";
import { AnswerContent } from "../styled/AnswerContent";
import { AnswerBox } from "../styled/AnswerBox";
import { IndexBox } from "../styled/IndexBox";

export const Answer = ({ answer, getStemNumeration, stemNumeration }) => {
  const [showPopover, togglePopover] = useState(false);
  const content = (
    <AnswerContent
      dangerouslySetInnerHTML={{
        __html: answer.value
      }}
    />
  );

  return (
    <CorrectAnswerBox
      className="answer-list"
      key={answer.id}
      onMouseEnter={() => togglePopover(true)}
      onMouseLeave={() => togglePopover(false)}
    >
      <IndexBox>{getStemNumeration(stemNumeration, answer.index)}</IndexBox>
      <Popover content={content} visible={showPopover && answer.value}>
        {content}
      </Popover>
    </CorrectAnswerBox>
  );
};

Answer.propTypes = {
  answer: PropTypes.object,
  stemNumeration: PropTypes.string.isRequired,
  getStemNumeration: PropTypes.func.isRequired
};

Answer.defaultProps = {
  answer: {}
};

const CorrectAnswerBox = styled(AnswerBox)`
  border: 1px solid ${greyishBorder};
  min-width: 140px;
  ${AnswerContent} {
    white-space: normal;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
