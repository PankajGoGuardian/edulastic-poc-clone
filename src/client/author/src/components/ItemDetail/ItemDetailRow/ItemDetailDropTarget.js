import React from 'react';
import { DropTarget } from 'react-dnd';
import styled from 'styled-components';
import { blue, white } from '@edulastic/colors';
import { FaArrowDown } from 'react-icons/fa';
import { compose } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Types } from '../constants';
import {
  moveItemDetailWidgetAction,
  setItemDetailDraggingAction
} from '../../../actions/itemDetail';

const ItemDetailDropTarget = ({ connectDropTarget, isOver, canDrop }) =>
  connectDropTarget(
    <div>
      <Container isOver={isOver} canDrop={canDrop}>
        <FaArrowDown />
      </Container>
    </div>
  );

ItemDetailDropTarget.propTypes = {
  moveItemDetailWidget: PropTypes.func.isRequired,
  widgetIndex: PropTypes.number.isRequired,
  rowIndex: PropTypes.number.isRequired,
  setItemDetailDragging: PropTypes.func.isRequired,
  tabIndex: PropTypes.number
};

const itemSource = {
  drop({ moveItemDetailWidget, widgetIndex, rowIndex, tabIndex, setItemDetailDragging }, monitor) {
    const from = monitor.getItem();
    const to = {
      widgetIndex,
      rowIndex,
      tabIndex
    };

    moveItemDetailWidget({
      from,
      to
    });
    setItemDetailDragging(false);
    return { moved: true };
  }
};

function collect(c, monitor) {
  return {
    connectDropTarget: c.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  };
}

const enhance = compose(
  connect(
    null,
    {
      moveItemDetailWidget: moveItemDetailWidgetAction,
      setItemDetailDragging: setItemDetailDraggingAction
    }
  ),
  DropTarget(Types.WIDGET, itemSource, collect)
);

export default enhance(ItemDetailDropTarget);

const Container = styled.div`
  border: 2px dashed ${blue};
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  color: ${({ isOver, canDrop }) => (isOver && canDrop ? white : blue)};
  background: ${({ isOver, canDrop }) => (isOver && canDrop ? blue : white)};
`;
