import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { DragDrop } from "@edulastic/common";
import Item from "./Item";

const { DragItem } = DragDrop;

const DragItemContainer = ({
  item,
  valid,
  preview,
  renderIndex,
  isTransparent,
  dragHandle,
  disableDrag,
  multiRow,
  from,
  fromColumnId,
  ...rest
}) => {
  const itemProps = {
    isTransparent,
    valid,
    preview,
    dragHandle,
    renderIndex,
    item,
    ...rest
  };
  const itemTo = {
    item,
    from,
    fromColumnId
  };

  return (
    <MainWrapper>
      {disableDrag && <Item {...itemProps} showIndex />}
      {!disableDrag && (
        <DragItem data={itemTo} className="drag-item" data-cy={`drag-drop-item-${renderIndex}`}>
          <Item {...itemProps} />
        </DragItem>
      )}
    </MainWrapper>
  );
};

DragItemContainer.propTypes = {
  item: PropTypes.string.isRequired,
  isDragging: PropTypes.bool.isRequired,
  preview: PropTypes.bool.isRequired,
  renderIndex: PropTypes.number.isRequired,
  isTransparent: PropTypes.bool,
  dragHandle: PropTypes.bool,
  valid: PropTypes.bool,
  disableDrag: PropTypes.bool,
  width: PropTypes.number,
  maxWidth: PropTypes.number.isRequired,
  minWidth: PropTypes.number.isRequired,
  minHeight: PropTypes.number.isRequired,
  maxHeight: PropTypes.number.isRequired
};

DragItemContainer.defaultProps = {
  disableDrag: false,
  isTransparent: false,
  dragHandle: false,
  valid: false,
  width: null
};

const MainWrapper = styled.div`
  max-width: 100%;
  margin: 5px;
  transform: translate3d(0px, 0px, 0px);
`;

export default DragItemContainer;
