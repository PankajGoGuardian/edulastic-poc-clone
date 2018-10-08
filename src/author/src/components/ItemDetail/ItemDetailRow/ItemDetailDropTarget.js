import React from 'react';
import { DropTarget } from 'react-dnd';
import styled from 'styled-components';
import { blue, white } from '@edulastic/colors';
import { FaArrowDown } from 'react-icons/fa';

import { Types } from '../constants';

const ItemDetailDropTarget = ({ connectDropTarget, isOver, canDrop }) =>
  connectDropTarget(
    <div>
      <Container isOver={isOver} canDrop={canDrop}>
        <FaArrowDown />
      </Container>
    </div>,
  );

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
  };
}

export default DropTarget(Types.WIDGET, {}, collect)(ItemDetailDropTarget);

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
