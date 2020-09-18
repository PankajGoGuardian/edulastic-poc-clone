import React, { useContext, useRef } from "react";
import { useDragLayer } from "react-dnd";
import styled from "styled-components";
import { get, isUndefined } from "lodash";
import { ScrollContext, HorizontalScrollContext } from "@edulastic/common";

const layerStyles = {
  position: "fixed",
  pointerEvents: "none",
  zIndex: 100,
  left: 0,
  top: 0,
  width: "100%",
  transform: "scale(1) !important",
  height: "100%"
};

const getItemStyles = (initialOffset, currentOffset, itemDimensions) => {
  if (!initialOffset || !currentOffset) {
    return {
      display: "none"
    };
  }
  const { x, y } = currentOffset;
  const transform = `translate(${x}px, ${y}px)`;
  return {
    transform,
    WebkitTransform: transform,
    background: "white",
    ...itemDimensions
  };
};

const getContainerTop = element => {
  if (isUndefined(element.offsetTop)) {
    return 70;
  }
  return element.offsetTop;
};

const getContainerBottom = element => {
  if (isUndefined(element.offsetTop)) {
    return window.innerHeight;
  }
  return element.offsetTop + element.offsetHeight;
};

const getContainerLeft = element => {
  if (isUndefined(element.offsetLeft)) {
    return 70;
  }
  return element.offsetLeft;
};

const getContainerRight = element => {
  if (isUndefined(element.offsetLeft)) {
    return window.innerWidth;
  }
  return element.offsetWidth + element.offsetLeft;
};

/**
 * @param {boolean} showPoint
 * needed only for graph placement type at this moment.
 * dragging value is on dropcontainer, showPoint is true, otherwise it is false
 */
const CustomDragLayer = ({ showPoint }) => {
  const verticalInterval = useRef(null);
  const horizontalInterval = useRef(null);
  const { isDragging, item, initialOffset, currentOffset } = useDragLayer(monitor => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging()
  }));

  if (!item || !isDragging) {
    return null;
  }

  const itemDimensions = get(item, "dimensions", { width: 0, height: 0 });
  // ------------- vertical drag scroll start -----------------
  const { getScrollElement } = useContext(ScrollContext);
  const scrollEl = getScrollElement();

  if (scrollEl) {
    const top = getContainerTop(scrollEl);
    const bottom = getContainerBottom(scrollEl);
    const containerTop = top;
    const containerBottom = bottom - itemDimensions.height - 50; // window.innerHeight - 50;
    const yOffset = get(currentOffset, "y", null);
    const scrollByVertical = yOffset < containerTop ? -10 : 10;

    if (
      !verticalInterval.current &&
      scrollByVertical &&
      yOffset &&
      (yOffset < containerTop || yOffset > containerBottom)
    ) {
      verticalInterval.current = setInterval(() => {
        scrollEl.scrollBy({
          top: scrollByVertical,
          behavior: "smooth"
        });
      }, 50);
    } else if (verticalInterval.current && ((yOffset > containerTop && yOffset < containerBottom) || !yOffset)) {
      clearInterval(verticalInterval.current);
      verticalInterval.current = null;
    }
  }
  // ------------- vertical drag scroll end ------------------

  // ------------- horizontal drag scroll start ------------------
  const horizontalScrollContext = useContext(HorizontalScrollContext);
  const horizontalScrollEl = horizontalScrollContext.getScrollElement();

  if (horizontalScrollEl) {
    const containerLeft = getContainerLeft(horizontalScrollEl);
    const containerRight = getContainerRight(horizontalScrollEl) - itemDimensions.width;
    const xOffset = get(currentOffset, "x", null);
    const scrollByHorizontal = xOffset < containerLeft ? -10 : 10;

    if (
      !horizontalInterval.current &&
      scrollByHorizontal &&
      xOffset &&
      (xOffset < containerLeft || xOffset > containerRight)
    ) {
      horizontalInterval.current = setInterval(() => {
        horizontalScrollEl.scrollBy({
          left: scrollByHorizontal
        });
      }, 50);
    } else if (horizontalInterval.current && ((xOffset > containerLeft && xOffset < containerRight) || !xOffset)) {
      clearInterval(horizontalInterval.current);
      horizontalInterval.current = null;
    }
  }
  // ------------- horizontal drag scroll end ------------------

  /**
   * prview is React element from dragItem.
   * please have a look at useDrag section of dragItem
   */
  const preview = get(item, "preview");
  const style = getItemStyles(initialOffset, currentOffset, itemDimensions);

  return (
    <div style={layerStyles}>
      <div style={style}>
        {preview}
        {showPoint && (
          <DraggingPointer>
            <DraggingPoint />
          </DraggingPointer>
        )}
      </div>
    </div>
  );
};

export default CustomDragLayer;

// these components needed only for graph type
const DraggingPointer = styled.div`
  position: absolute;
  margin-top: -1px;
  left: calc(25% - 6px);
  z-index: 1000;

  &::before {
    content: "";
    display: block;
    position: absolute;
    top: 0px;
    width: 0;
    height: 0;
    border-top: 8px solid #434b5d;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 0px;
  }
  &::after {
    content: "";
    display: block;
    position: absolute;
    top: 0px;
    left: 1px;
    width: 0;
    height: 0;

    border-top: 7px solid white;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 0px;
  }
`;

const DraggingPoint = styled.div`
  position: absolute;
  top: 8px;
  left: 1px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #434b5d;
`;
