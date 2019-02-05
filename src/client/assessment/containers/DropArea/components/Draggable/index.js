import React from 'react';
import PropTypes from 'prop-types';

import { IconTrashAlt } from '@edulastic/icons';
import { greenDark, red } from '@edulastic/colors';

import { Pointer } from '../../../../styled/Pointer';
import { Point } from '../../../../styled/Point';
import { Triangle } from '../../../../styled/Triangle';

import Resizer from './components/Resizer';
import { DeleteButton } from './styled/DeleteButton';

// draggable Component
class Draggable extends React.Component {
  onMouseDown = (e) => {
    const { updateStateDragging, id } = this.props;
    const elm = document.elementFromPoint(e.clientX, e.clientY);
    if (elm.className !== 'resizer') {
      updateStateDragging(id, true);
    }
  };

  onMouseUp = () => {
    const { updateStateDragging, id } = this.props;
    updateStateDragging(id, false);
  };

  onDragStart = (e) => {
    const { updateStateDragging, id } = this.props;
    const nodeStyle = this.node.style;
    const element = e.target;
    setTimeout(() => {
      element.classList.add('hideDraggableSource');
    });
    e.dataTransfer.setData('application/json', JSON.stringify({
      id,
      // mouse position in a draggable element
      x: e.clientX - parseInt(nodeStyle.left, 10),
      y: e.clientY - parseInt(nodeStyle.top, 10)
    }));
    this.startMousePoint = {
      x: e.clientX,
      y: e.clientY
    };
    updateStateDragging(id, true);
  };

  onDragEnd = (e) => {
    const element = e.target;
    element.classList.remove('hideDraggableSource');
    const { updateStateDragging, id } = this.props;
    updateStateDragging(id, false);
  };

  render() {
    const {
      top,
      left,
      width,
      height,
      isDragging,
      id,
      pointerPosition,
      responseContainerActivated,
      active,
      isResizing,
      updateStateResizing,
      funcResizing,
      onRemove,
      showDashedBorder
    } = this.props;
    const styles = {
      top,
      left,
      width,
      height,
      border: showDashedBorder ? 'dashed 2px rgba(0, 0, 0, 0.65)' : 'solid 1px lightgray'
    };
    return (
      <div
        ref={(c) => { this.node = c; }}
        draggable={isDragging}
        id={`item_${id}`}
        className={`item unselectable imagelabeldragdrop-droppable ${active ? 'active' : ''}`}
        style={styles}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
        onClick={responseContainerActivated}
      >
        <span className="index-box">{id + 1}</span>
        <span className="label-box">&nbsp;</span>
        <DeleteButton onClick={() => onRemove(id)}>
          <IconTrashAlt color={greenDark} hoverColor={red} />
        </DeleteButton>
        <Resizer
          id={id}
          isResizing={isResizing}
          resizerWidth={6}
          resizerHeight={6}
          updateStateResizing={updateStateResizing}
          funcResizing={funcResizing}
        />
        <Pointer className={pointerPosition} width={width}>
          <Point />
          <Triangle />
        </Pointer>
      </div>
    );
  }
}
Draggable.propTypes = {
  id: PropTypes.any.isRequired,
  isDragging: PropTypes.bool,
  isResizing: PropTypes.bool,
  top: PropTypes.number.isRequired,
  left: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  updateStateDragging: PropTypes.func.isRequired,
  updateStateResizing: PropTypes.func.isRequired,
  funcResizing: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  responseContainerActivated: PropTypes.func.isRequired,
  active: PropTypes.bool,
  showDashedBorder: PropTypes.bool,
  pointerPosition: PropTypes.string
};

Draggable.defaultProps = {
  pointerPosition: undefined,
  active: false,
  showDashedBorder: false,
  isResizing: false,
  isDragging: false
};

export default Draggable;
