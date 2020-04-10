import React from "react";
import { Popover } from "antd";
import PropTypes from "prop-types";

import { measureTextWithImage, MathSpan } from "@edulastic/common";
import { response } from "@edulastic/constants";
import { DragHandler, ChoiceItem } from "../../../components/ChoiceItem";

/**
 *
 * @param {String} userAnswer
 * @param {Boolean} inPopover
 * @param {Boolean} showDragHandle
 * @param {Object} itemStyle
 *
 * This function returns the content of the response box
 * if the content is shown inside the popover, it overrrides the default style
 * and shows the enitre content, which was clipped in the response box
 */

function getContent(userAnswer, inPopover = false, showDragHandle, itemStyle) {
  const overrideContainerStyles = {};
  if (inPopover) {
    overrideContainerStyles.overflow = "auto";
    overrideContainerStyles.justifyContent = "flex-start";
  }

  return (
    <ChoiceItem style={{ ...itemStyle, ...overrideContainerStyles }}>
      {showDragHandle && <DragHandler />}
      <MathSpan dangerouslySetInnerHTML={{ __html: userAnswer }} />
    </ChoiceItem>
  );
}

/**
 *
 * @param {Object} containerStyle
 * @param {String} userAnswer
 * @param {Boolean} showDragHandler
 *
 * The component is used to determine whether the content
 * given insde the response box is greater than the box dimensions
 *
 * In that case, it will wrap a popover over the response box
 * and entire content will be shown in the popover
 * when hovered over the resposne
 */

export function WithPopover({ containerStyle, userAnswer, showDragHandler }) {
  const { scrollWidth: contentWidth } = measureTextWithImage({
    text: userAnswer,
    targetChild: "p",
    childStyle: { display: "inline" }
  });
  const widthOverflow = containerStyle.maxWidth <= contentWidth;
  const content = getContent(userAnswer, false, showDragHandler, containerStyle);
  const popoverContent = getContent(userAnswer, true, showDragHandler, containerStyle);

  return widthOverflow ? (
    <Popover key={userAnswer} content={popoverContent} getPopupContainer={triggerNode => triggerNode.parentNode}>
      {content}
    </Popover>
  ) : (
    content
  );
}

WithPopover.propTypes = {
  containerStyle: PropTypes.object,
  userAnswer: PropTypes.string.isRequired,
  showDragHandler: PropTypes.bool
};

WithPopover.defaultProps = {
  showDragHandler: false,
  containerStyle: {
    maxWidth: response.maxWidth // 400px
  }
};
