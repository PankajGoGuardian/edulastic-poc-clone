import React, { useRef, useEffect, useState } from "react";
import { DragSource } from "react-dnd";
import { Popover } from "antd";
import { MathFormulaDisplay, isMobileDevice, measureText } from "@edulastic/common";
import { Index } from "../styled/Index";
import { IconClose } from "../styled/IconClose";
import { IconCheck } from "../styled/IconCheck";
import { Wrapper } from "../styled/Wrapper";
import { CLEAR } from "../../../constants/constantsForQuestions";
import DragPreview from "../../../components/SourceDragPreview";

function collectSource(connector, monitor) {
  return {
    connectDragSource: connector.dragSource(),
    isDragging: monitor.isDragging()
  };
}

const specSource = {
  beginDrag(props) {
    if (props.previewTab !== CLEAR && typeof props.changePreviewTab === "function") {
      props.changePreviewTab();
    }
    return { item: props.item, sourceFlag: props.flag, sourceIndex: props.renderIndex };
  },

  endDrag(props, monitor) {
    if (!monitor.didDrop()) {
      return;
    }
    const itemCurrent = monitor.getItem();

    const itemTo = monitor.getDropResult();

    props.onDrop(itemCurrent, itemTo, true);
  },
  canDrag(props) {
    return props.disableResponse !== true;
  }
};

const DragItem = ({
  connectDragSource,
  item,
  isDragging,
  flag,
  correct,
  preview,
  showAnswer,
  renderIndex,
  displayIndex,
  getStyles,
  width,
  centerContent,
  isPrintPreview,
  ...restProps
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
      currentRef.removeEventListener("touchstart", handleOnHover);
      currentRef.removeEventListener("touchmove", handleOnHover);
      currentRef.removeEventListener("touchend", handleOnHover);
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
    currentRef.addEventListener("touchstart", handleOnHover);
    currentRef.addEventListener("touchmove", handleOnHover);
    currentRef.addEventListener("touchend", handleOnHover);
  }, [showPopover]);

  const getContent = (
    <div
      className="drag-drop-item-match-list"
      data-cy={`drag-drop-item-${renderIndex}`}
      style={{
        ...getStyles({ isDragging, flag, _preview: preview, correct, width })
      }}
    >
      {isMobileDevice() && (
        <DragPreview isDragging={isDragging} {...restProps}>
          {itemView}
        </DragPreview>
      )}

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

  return (
    item &&
    connectDragSource(
      <div className="__prevent-page-break" ref={currentActiveItem} style={{ maxWidth: "100%" }}>
        <Popover visible={showPopover && !!isActive && !isDragging} content={getContent}>
          {getContent}
        </Popover>
      </div>
    )
  );
};

export default DragSource("item", specSource, collectSource)(DragItem);
