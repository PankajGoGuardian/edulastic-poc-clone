import React from "react";
import { Popover } from "antd";
import PropTypes from "prop-types";

import { MathSpan } from "@edulastic/common";
import { response } from "@edulastic/constants";

/**
 *
 * checks if its shown inside a popover, adds extra styles to the content in that case
 * @param {boolean} inPopover
 * @param {string} answer
 * @returns a response box showing the correct answer
 */
function getContent(inPopover, answer) {
  const style = {};
  if (inPopover) {
    style.maxWidth = `${response.popoverMaxWidth}px`;
    style.overflow = "auto";
  }
  return (
    <div style={style}>
      <MathSpan dangerouslySetInnerHTML={{ __html: answer }} />
    </div>
  );
}

function Answer({ answer, showPopover }) {
  const answerContent = getContent(false, answer);
  const popoverContent = getContent(true, answer);
  if (showPopover) {
    return <Popover content={popoverContent}>{answerContent}</Popover>;
  }
  return answerContent;
}

Answer.propTypes = {
  answer: PropTypes.string.isRequired,
  showPopover: PropTypes.bool.isRequired
};

export default Answer;
