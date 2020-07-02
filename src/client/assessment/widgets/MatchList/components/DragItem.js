import React from "react";
import { DragSource } from "react-dnd";
import { MathFormulaDisplay, isMobileDevice } from "@edulastic/common";
import { white } from "@edulastic/colors";
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
  const itemView = (
    <Wrapper>
      <MathFormulaDisplay centerContent={centerContent} dangerouslySetInnerHTML={{ __html: item?.label || "" }} />
    </Wrapper>
  );

  return (
    item &&
    connectDragSource(
      <div className="__prevent-page-break">
        <div
          className="drag-drop-item-match-list"
          data-cy={`drag-drop-item-${renderIndex}`}
          style={{
            ...getStyles({ isDragging, flag, _preview: preview, correct, width }),
            background: isPrintPreview && white
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
      </div>
    )
  );
};

export default DragSource("item", specSource, collectSource)(DragItem);
