import React from 'react';
import { DragSource } from 'react-dnd';

import { green, red } from '@edulastic/colors';
import { IconCheck, IconClose } from '@edulastic/icons';

import { Index } from '../styled/Index';

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
      <div dangerouslySetInnerHTML={{ __html: item }} />
      {preview && (
        <div style={{ marginRight: 15 }}>
          {correct && <IconCheck color={green} width={12} height={10} />}
          {!correct && <IconClose color={red} width={10} height={10} />}
        </div>
      )}
    </div>
  );

export default DragSource('item', specSource, collectSource)(DragItem);
