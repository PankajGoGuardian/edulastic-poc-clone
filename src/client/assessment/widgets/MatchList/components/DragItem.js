import React from "react";
import { DragSource } from "react-dnd";

import { MathFormulaDisplay } from "@edulastic/common";
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
    return { item: props.item };
  },

  endDrag(props, monitor) {
    if (!monitor.didDrop()) {
      return;
    }

    const itemCurrent = monitor.getItem();

    const itemTo = monitor.getDropResult();

    props.onDrop(itemCurrent, itemTo);
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
  renderIndex,
  getStyles,
  width,
  centerContent,
  ...restProps
}) => {
  const itemView = (
    <Wrapper>
      <MathFormulaDisplay style={centerContent} dangerouslySetInnerHTML={{ __html: item }} />
    </Wrapper>
  );

  return (
    item &&
    connectDragSource(
      <div
        className="drag-drop-item-match-list"
        data-cy={`drag-drop-item-${renderIndex}`}
        style={getStyles({ isDragging, flag, preview, correct, width })}
      >
        <DragPreview isDragging={isDragging} {...restProps}>
          {itemView}
        </DragPreview>
        {preview && <Index correct={correct}>{renderIndex}</Index>}
        {itemView}
        {preview && (
          <div style={{ marginRight: 15 }}>
            {correct && <IconCheck />}
            {!correct && <IconClose />}
          </div>
        )}
      </div>
    )
  );
};

export default DragSource("item", specSource, collectSource)(DragItem);
