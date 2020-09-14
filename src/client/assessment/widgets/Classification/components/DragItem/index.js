/* eslint-disable react/require-default-props */
import React from "react";
import PropTypes from "prop-types";
import { DragSource } from "react-dnd";
import styled from "styled-components";
import { isMobileDevice } from "@edulastic/common";
import DragPreview from "./DragPreview";

import Item from "./Item";

function collectSource(connector, monitor) {
  return {
    connectDragSource: connector.dragSource(),
    isDragging: monitor.isDragging()
  };
}

const specSource = {
  beginDrag(props) {
    return { item: props.item };
  },

  endDrag(props, monitor) {
    if (!monitor.didDrop()) {
      return;
    }

    const { fromColumnId } = props;
    const itemCurrent = monitor.getItem();

    const itemTo = monitor.getDropResult();

    props.onDrop(itemCurrent, itemTo, props.from, fromColumnId);
  },
  canDrag(props) {
    return props.disableResponse !== true;
  }
};

const DragItemContainer = ({
  connectDragSource,
  item,
  isDragging,
  valid,
  preview,
  renderIndex,
  isTransparent,
  dragHandle,
  isResetOffset,
  disableDrag,
  multiRow,
  ...rest
}) => {
  const itemProps = {
    isDragging,
    isTransparent,
    valid,
    preview,
    dragHandle,
    renderIndex,
    item,
    ...rest
  };
  return (
    <MainWrapper>
      {disableDrag && <Item {...itemProps} showIndex />}
      {!disableDrag && (
        <>
          {isMobileDevice() && (
            <DragPreview isDragging={isDragging} isResetOffset={isResetOffset}>
              <Item {...itemProps} isDragging={false} />
            </DragPreview>
          )}
          {item &&
            connectDragSource(
              <div className="drag-item" data-cy={`drag-drop-item-${renderIndex}`}>
                <Item {...itemProps} />
              </div>
            )}
        </>
      )}
    </MainWrapper>
  );
};

DragItemContainer.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  item: PropTypes.string.isRequired,
  isDragging: PropTypes.bool.isRequired,
  preview: PropTypes.bool.isRequired,
  renderIndex: PropTypes.number.isRequired,
  isTransparent: PropTypes.bool,
  dragHandle: PropTypes.bool,
  valid: PropTypes.bool,
  disableDrag: PropTypes.bool,
  isResetOffset: PropTypes.bool,
  width: PropTypes.number,
  maxWidth: PropTypes.number.isRequired,
  minWidth: PropTypes.number.isRequired,
  minHeight: PropTypes.number.isRequired,
  maxHeight: PropTypes.number.isRequired
};

DragItemContainer.defaultProps = {
  isResetOffset: false,
  disableDrag: false
};

const MainWrapper = styled.div`
  max-width: 100%;
  margin: 5px;
  transform: translate3d(0px, 0px, 0px);
`;

export default DragSource("item", specSource, collectSource)(DragItemContainer);
