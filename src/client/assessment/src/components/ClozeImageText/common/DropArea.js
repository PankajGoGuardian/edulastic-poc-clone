/* eslint-disable react/no-find-dom-node */
/* eslint-disable react/no-string-refs */
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import Draggable from './Draggable';

class DropArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: props.item.responses
    };
    this.draggableRefs = [];
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      list: nextProps.item.responses
    });
  }

  onDragOver = (e) => {
    e.preventDefault();
    return false;
  }

  onDrop = (e) => {
    e.preventDefault();
    const { updateData } = this.props;
    const obj = JSON.parse(e.dataTransfer.getData('application/json'));
    const { list } = this.state;
    const index = obj.id;
    list[index].isDragging = false;
    list[index].top = (e.clientY - obj.y);
    list[index].left = (e.clientX - obj.x);
    updateData(list);
  }

  updateStateDragging = (id, isDragging) => {
    const { updateData } = this.props;
    const { list } = this.state;
    list[id].isDragging = isDragging;
    updateData(list);
  }

  updateStateResizing = (id, isResizing) => {
    const { updateData } = this.props;
    const { list } = this.state;
    list[id].isResizing = isResizing;
    updateData(list);
  }

  funcResizing = (id, clientX, clientY) => {
    const { updateData } = this.props;
    const node = ReactDOM.findDOMNode(this.refs[`node_${id}`]);
    const { list } = this.state;
    const index = id;
    const elemRect = node.getBoundingClientRect();
    const offsetTop = elemRect.top;
    const offsetLeft = elemRect.left;
    list[index].width = clientX - offsetLeft + (16 / 2);
    list[index].height = clientY - offsetTop + (16 / 2);
    updateData(list);
  }

  removeListResponseContainer = (id) => {
    const { updateData } = this.props;
    const { list } = this.state;
    list.splice(id, 1);
    updateData(list);
  }

  addNewResponseContainer = (e) => {
    const { updateData } = this.props;
    const { list } = this.state;
    const newResponseContainer = {};
    const node = ReactDOM.findDOMNode(this.refs.drop_area);
    const elemRect = node.getBoundingClientRect();

    newResponseContainer.isDragging = false;
    newResponseContainer.top = (e.clientY - elemRect.top);
    newResponseContainer.left = (e.clientX - elemRect.left);
    newResponseContainer.width = 150;
    newResponseContainer.height = 40;
    newResponseContainer.active = true;
    list.forEach((responseContainer) => {
      responseContainer.active = false;
    });
    list.push(newResponseContainer);
    updateData(list);
  }

  responseContainerActivated = (id, e) => {
    e.stopPropagation();
    const { updateData } = this.props;
    const { list } = this.state;
    list.forEach((responseContainer) => {
      responseContainer.active = false;
    });
    list[id].active = true;
    updateData(list);
  }

  render() {
    const responseContainers = [];
    const { list } = this.state;
    const { item } = this.props;

    // eslint-disable-next-line no-restricted-syntax
    for (const [index, responseContainer] of list.entries()) {
      responseContainers.push(
        <div key={index}>
          <Draggable
            ref={`node_${index}`}
            key={index}
            id={index}
            top={responseContainer.top}
            left={responseContainer.left}
            width={responseContainer.width}
            height={responseContainer.height}
            active={responseContainer.active}
            isDragging={responseContainer.isDragging}
            isResizing={responseContainer.isResizing}
            showDashedBorder={item.responseLayout && item.responseLayout.showdashedborder}
            background={item.responseLayout && item.responseLayout.background}
            updateStateDragging={this.updateStateDragging}
            updateStateResizing={this.updateStateResizing}
            funcResizing={this.funcResizing}
            onRemove={this.removeListResponseContainer}
            responseContainerActivated={e => this.responseContainerActivated(index, e)}
            pointerPosition={responseContainer.pointerPosition}
            label={responseContainer.label || ''}
          />
        </div>
      );
    }
    return (
      <div
        className="drop-area"
        onDragOver={this.onDragOver}
        onDrop={this.onDrop}
        ref="drop_area"
        style={{
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          minHeight: 400
        }}
        onClick={this.addNewResponseContainer}
      >
        {responseContainers}
      </div>
    );
  }
}

DropArea.propTypes = {
  updateData: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired
};

export default DropArea;
