import React from "react";
import { measureTextWithImage } from "@edulastic/common";
import { Popover } from "antd";
import styled from "styled-components";

import { PopoverContent } from "./PopoverContent";

export function WithPopover({
  children,
  userAnswer,
  containerDimensions,
  fontSize,
  className,
  status,
  checkAnswer,
  indexStr
}) {
  // eslint-disable-next-line max-len
  const { scrollWidth: contentWidth, scrollHeight: contentHeight } = measureTextWithImage({
    text: userAnswer,
    style: { fontSize },
    targetChild: "p",
    childStyle: { display: "inline" }
  });
  const { height: containerHeight, width: containerWidth } = containerDimensions;

  const indexBoxWidth = checkAnswer ? 0 : 40;
  const heightOverflow = contentHeight > parseInt(containerHeight, 10);
  const widthOverflow = contentWidth + indexBoxWidth > parseInt(containerWidth, 10);
  const showPopover = heightOverflow || widthOverflow;

  if (showPopover) {
    const popoverContent = (
      <PopoverContent
        fontSize={fontSize}
        answer={userAnswer}
        status={status}
        className={className}
        checkAnswer={checkAnswer}
        indexStr={indexStr}
      />
    );
    return (
      <Wrapper>
        <Popover
          placement="bottomLeft"
          content={popoverContent}
          getPopupContainer={triggerNode => triggerNode.parentNode}
        >
          {children}
        </Popover>
      </Wrapper>
    );
  }
  return children;
}

const Wrapper = styled.div`
  .text-wrapper {
    margin-right: auto;
    width: calc(100% - 30px) !important;
    overflow: hidden;

    ::after {
      content: "...";
      position: absolute;
      right: 1rem;
    }
  }
`;
