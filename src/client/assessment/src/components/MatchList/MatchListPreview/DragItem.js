import React from 'react';
import { DragSource } from 'react-dnd';

import { white, green, red } from '@edulastic/colors';
import styled from 'styled-components';
import { IconCheck, IconClose } from '@edulastic/icons';

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

    const itemCurrent = monitor.getItem();

    const itemTo = monitor.getDropResult();

    props.onDrop(itemCurrent, itemTo);
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
  getStyles
}) =>
  item &&
  connectDragSource(
    <div style={getStyles({ isDragging, flag, preview, correct })}>
      {preview && <Index correct={correct}>{renderIndex + 1}</Index>}
      {item}
      {preview && (
        <div style={{ marginRight: 15 }}>
          {correct && <IconCheck color={green} width={12} height={10} />}
          {!correct && <IconClose color={red} width={10} height={10} />}
        </div>
      )}
    </div>
  );

export default DragSource('item', specSource, collectSource)(DragItem);

const Index = styled.div`
  height: 40px;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  background: ${({ correct }) => (correct ? green : red)};
  color: ${white};
  font-weight: 600;
  font-size: 14px;
`;
