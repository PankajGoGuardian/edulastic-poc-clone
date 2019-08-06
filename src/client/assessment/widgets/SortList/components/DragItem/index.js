import React from "react";
import { DragSource } from "react-dnd";
import PropTypes from "prop-types";
import { compose } from "redux";
import { withTheme } from "styled-components";

import { CHECK, SHOW, CLEAR } from "../../../../constants/constantsForQuestions";
import { TextEmpty } from "./styled/TextEmpty";
import DragPreview from "../../../../components/DragPreview";
import { DragItemContent } from "./DragItemContent";

function collectSource(connector, monitor) {
  return {
    connectDragSource: connector.dragSource(),
    isDragging: monitor.isDragging()
  };
}

const specSource = {
  beginDrag(props) {
    const item = { item: props.obj, index: props.index };
    props.onClick({});

    if (props.previewTab !== CLEAR) {
      props.changePreviewTab();
    }
    return item;
  },

  endDrag(props, monitor) {
    if (!monitor.didDrop()) {
      return;
    }

    const itemCurrent = monitor.getItem();

    const itemTo = monitor.getDropResult();

    props.onDrop(itemCurrent, itemTo, props.flag);
  },
  canDrag(props) {
    return props.disableResponse !== true;
  }
};

const DragItem = ({
  connectDragSource,
  obj,
  isDragging,
  onClick,
  active,
  smallSize,
  correct,
  previewTab,
  index,
  theme,
  isResetOffset
}) => {
  const showPreview = previewTab === CHECK || previewTab === SHOW;
  return (
    <div>
      <DragPreview isDragging={isDragging} isResetOffset={isResetOffset}>
        <DragItemContent active={active} correct={correct} obj={obj} showPreview={showPreview} smallSize={smallSize} />
      </DragPreview>
      {obj ? (
        connectDragSource(
          <div
            onClick={() => (active ? onClick("") : onClick(obj))}
            style={{
              opacity: isDragging ? 0 : 1,
              background: active
                ? theme.widgets.sortList.dragItemActiveBgColor
                : theme.widgets.sortList.dragItemBgColor,
              borderRadius: 4
            }}
          >
            <DragItemContent
              active={active}
              correct={correct}
              obj={obj}
              showPreview={showPreview}
              smallSize={smallSize}
            />
          </div>
        )
      ) : (
        <div>
          <TextEmpty smallSize={smallSize} />
        </div>
      )}
    </div>
  );
};

DragItem.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  obj: PropTypes.any,
  isDragging: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  active: PropTypes.bool.isRequired,
  smallSize: PropTypes.bool.isRequired,
  correct: PropTypes.bool,
  previewTab: PropTypes.string,
  index: PropTypes.number.isRequired,
  theme: PropTypes.object.isRequired,
  isResetOffset: PropTypes.bool
};

DragItem.defaultProps = {
  obj: null,
  correct: false,
  previewTab: CLEAR,
  isResetOffset: false
};

const enhance = compose(
  DragSource("item", specSource, collectSource),
  withTheme
);

export default enhance(DragItem);
