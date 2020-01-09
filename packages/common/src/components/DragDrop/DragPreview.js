import React, { useContext, useRef } from "react";
import { useDragLayer } from "react-dnd";
import { get } from "lodash";
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

const getItemStyles = (initialOffset, currentOffset) => {
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
    width: "max-content"
  };
};

const CustomDragLayer = () => {
  const verticalInterval = useRef(null);
  const horizontalInterval = useRef(null);
  const { isDragging, item, initialOffset, currentOffset } = useDragLayer(monitor => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging()
  }));

  // ------------- vertical drag scroll start -----------------
  const scrollContext = useContext(ScrollContext);
  const scrollEl = scrollContext.getScrollElement();

  if (scrollEl) {
    const containerTop = scrollEl.offsetTop + 20;
    const containerBottom = scrollEl.offsetTop + scrollEl.offsetHeight - 50; // window.innerHeight - 50;
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
          top: scrollByVertical
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
    const containerLeft = horizontalScrollEl.offsetLeft + 40;
    const containerRight = horizontalScrollEl.offsetWidth + containerLeft - 60;
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

  if (!isDragging) {
    return null;
  }

  /**
   * prview is React element from dragItem.
   * please have a look at useDrag section of dragItem
   */
  const preview = get(item, "preview");
  const style = getItemStyles(initialOffset, currentOffset);

  return (
    <div style={layerStyles}>
      <div style={style}>{preview}</div>
    </div>
  );
};

export default CustomDragLayer;
