import React, { useState } from "react";
import PropTypes from "prop-types";
import { Popover } from "antd";
import { AnswerContent } from "../styled/AnswerContent";
import { AnswerBox } from "../styled/AnswerBox";
import { IndexBox } from "../styled/IndexBox";

export const Answer = ({ answer, getStemNumeration, stemNumeration }) => {
  const [showPopover, togglePopover] = useState(false);
  const content = (
    <AnswerContent
      style={{
        whiteSpace: "normal",
        minWidth: 70,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
      dangerouslySetInnerHTML={{
        __html: answer.value
      }}
    />
  );

  return (
    <AnswerBox
      className="answer-list"
      key={answer.id}
      onMouseEnter={() => togglePopover(true)}
      onMouseLeave={() => togglePopover(false)}
    >
      <IndexBox>{getStemNumeration(stemNumeration, answer.index)}</IndexBox>
      <Popover content={content} visible={showPopover && answer.value}>
        {content}
      </Popover>
    </AnswerBox>
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
