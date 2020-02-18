import React from "react";
import { Popover } from "antd";
import PropTypes from "prop-types";
import { MathSpan } from "@edulastic/common";
import getImageDimensions from "../../../../hooks/imageDimensions";

const AnswerContent = ({ userAnswer, answer, lessMinWidth, height, popoverContent, isChecked, isOverContent }) => {
  const imageDimensions = getImageDimensions(answer);
  return lessMinWidth || isOverContent || height < imageDimensions.height ? (
    <Popover placement="bottomLeft" overlayClassName="customTooltip" content={popoverContent} isChecked={isChecked}>
      <MathSpan
        style={{ height: "100%", width: "100%", display: "flex", alignItems: "center" }}
        dangerouslySetInnerHTML={{ __html: userAnswer }}
      />
    </Popover>
  ) : (
    <MathSpan dangerouslySetInnerHTML={{ __html: userAnswer }} />
  );
};

AnswerContent.propTypes = {
  userAnswer: PropTypes.string.isRequired,
  answer: PropTypes.string.isRequired,
  lessMinWidth: PropTypes.bool.isRequired,
  height: PropTypes.oneOfType(PropTypes.bool, PropTypes.string).isRequired,
  popoverContent: PropTypes.object.isRequired,
  isChecked: PropTypes.bool.isRequired,
  isOverContent: PropTypes.bool.isRequired
};

export default AnswerContent;
