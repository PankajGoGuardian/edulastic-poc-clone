import React, { Fragment, useRef, useEffect, useState } from "react";
import { Popover } from "antd";
import { MathFormulaDisplay, measureText, DragDrop } from "@edulastic/common";
import { Index } from "../styled/Index";
import { IconClose } from "../styled/IconClose";
import { IconCheck } from "../styled/IconCheck";
import { Wrapper } from "../styled/Wrapper";

const DragItem = ({
  item,
  flag,
  correct,
  preview,
  showAnswer,
  renderIndex,
  displayIndex,
  getStyles,
  width,
  centerContent
}) => {
  const currentActiveItem = useRef(null);

  const [isActive, setActive] = useState(false);

  const [boxWidth, setBoxWidth] = useState(0);
  const { width: textWidth } = measureText(item?.label);

  const showPopover = boxWidth ? textWidth > boxWidth : false;

  const itemView = (
    <Wrapper>
      <MathFormulaDisplay centerContent={centerContent} dangerouslySetInnerHTML={{ __html: item?.label || "" }} />
    </Wrapper>
  );

  const handleOnHover = ev => {
    ev.stopPropagation();
    if (["mouseenter", "touchstart"].includes(ev?.type)) {
      setActive(true);
      return;
    }
    setActive(false);
  };

  // Cleanup
  useEffect(
    () => () => {
      const currentRef = currentActiveItem.current;
      if (!currentRef || !showPopover) return;
      currentRef.removeEventListener("mouseenter", handleOnHover);
      currentRef.removeEventListener("mouseleave", handleOnHover);
      currentRef.removeEventListener("mousedown", handleOnHover);
      // Do not add touch events here;
      // draggin item does not work on iPad
      // currentRef.removeEventListener("touchstart", handleOnHover);
      // currentRef.removeEventListener("touchmove", handleOnHover);
      // currentRef.removeEventListener("touchend", handleOnHover);
    },
    []
  );

  useEffect(() => {
    const currentRef = currentActiveItem.current;
    if (!currentRef) return;
    setBoxWidth(currentRef.clientWidth);
  }, [currentActiveItem?.current?.clientWidth]);

  useEffect(() => {
    const currentRef = currentActiveItem.current;
    if (!currentRef || !showPopover) return;
    currentRef.addEventListener("mouseenter", handleOnHover);
    currentRef.addEventListener("mouseleave", handleOnHover);
    currentRef.addEventListener("mousedown", handleOnHover);
    // Do not add touch events here;
    // draggin item does not work on iPad
    // currentRef.addEventListener("touchstart", handleOnHover);
    // currentRef.addEventListener("touchmove", handleOnHover);
    // currentRef.addEventListener("touchend", handleOnHover);
  }, [showPopover]);

  const getContent = (
    <div
      className="drag-drop-item-match-list"
      data-cy={`drag-drop-item-${renderIndex}`}
      style={getStyles({ flag, _preview: preview, correct, width })}
    >
      {correct !== undefined && preview && showAnswer && (
        <Index preview={preview} correct={correct}>
          {displayIndex}
        </Index>
      )}
      {itemView}
      {correct !== undefined && (
        <div style={{ marginRight: 15, opacity: preview ? "1" : "0" }}>
          {correct && <IconCheck />}
          {!correct && <IconClose />}
        </div>
      )}
    </div>
  );

  const dragItemProps = item
    ? {
        data: {
          item,
          sourceFlag: flag,
          sourceIndex: renderIndex
        },
        flag
      }
    : {};

  const DragItemCont = item ? DragDrop.DragItem : Fragment;

  return (
    <DragItemCont {...dragItemProps}>
      <div className="__prevent-page-break" ref={currentActiveItem} style={{ maxWidth: "100%" }}>
        <Popover visible={showPopover && !!isActive} content={getContent}>
          {getContent}
        </Popover>
      </div>
    </DragItemCont>
  );
};

export default DragItem;
