import React from "react";
import { measureTextWithImage } from "@edulastic/common";
import { Popover } from "antd";
import styled from "styled-components";

// eslint-disable-next-line max-len
export function Container({ height: containerHeight, fontSize, width: containerWidth, answers, children }) {
  const { scrollWidth: contentWidth, scrollHeight: contentHeight } = measureTextWithImage({
    text: answers,
    style: { fontSize },
    targetChild: "p",
    childStyle: { display: "inline" }
  });

  const widthOverflow = contentWidth > parseInt(containerWidth, 10) - 10;
  const heightOveflow = contentHeight >= parseInt(containerHeight, 10);
  const showPopover = widthOverflow || heightOveflow;

  if (showPopover) {
    return (
      <Wrapper>
        <Popover content={children} placement="bottomLeft" getPopupContainer={triggerNode => triggerNode.parentNode}>
          <div className="text-wrapper">{children}</div>
        </Popover>
      </Wrapper>
    );
  }

  return children;
}

const Wrapper = styled.div`
  width: 100%;
  .text-wrapper {
    display: flex;
    height: 100%;
    width: calc(100% - 20px);
    overflow: hidden;

    ::after {
      content: "...";
      position: absolute;
      right: 5px;
      display: flex;
      align-items: center;
      height: 100%;
    }

    div[draggable="true"] {
      width: max-content !important;
      overflow: unset !important;
    }
  }
`;
