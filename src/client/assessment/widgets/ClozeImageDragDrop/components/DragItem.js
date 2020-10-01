import React from 'react'
import { DragSource } from 'react-dnd'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import striptags from 'striptags'
import { isMobileDevice } from '@edulastic/common'

import DragPreview from '../../../components/SourceDragPreview'

function collectSource(connector, monitor) {
  return {
    connectDragSource: connector.dragSource(),
    isDragging: monitor.isDragging(),
  }
}

const specSource = {
  canDrag(props) {
    return !props.disableResponse
  },

  beginDrag(props) {
    const item = { item: props.obj, index: props.index }
    return item
  },

  endDrag(props, monitor, component) {
    if (!monitor.didDrop()) {
      return
    }

    const itemCurrent = monitor.getItem()
    const itemTo = monitor.getDropResult()
    const data = striptags(props.data) || ''
    let [, fromContainerIndex, fromRespIndex] = data.split('_')
    fromContainerIndex = parseInt(fromContainerIndex, 10)
    fromRespIndex = parseInt(fromRespIndex, 10)

    const node = ReactDOM.findDOMNode(component)
    const { height, width } = node.getBoundingClientRect()

    props.onDrop(
      {
        fromContainerIndex: Number.isNaN(fromContainerIndex)
          ? undefined
          : fromContainerIndex,
        fromRespIndex: Number.isNaN(fromRespIndex) ? undefined : fromRespIndex,
        item: props.item,
        index: itemCurrent.index,
        itemRect: { height, width, ...itemTo.position },
      },
      itemTo.index
    )
  },
}

class DragItem extends React.Component {
  render() {
    const {
      connectDragSource,
      data,
      children,
      style,
      disableResponse,
      ...restProps
    } = this.props
    return (
      data &&
      connectDragSource(
        <div
          style={{
            ...style,
            justifyContent: 'center',
          }}
          draggable={!disableResponse}
        >
          {!disableResponse && isMobileDevice() && (
            <DragPreview {...restProps}>{children}</DragPreview>
          )}
          {children}
        </div>
      )
    )
  }
}

DragItem.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  data: PropTypes.any,
  isDragging: PropTypes.bool.isRequired,
  children: PropTypes.any.isRequired,
  disableResponse: PropTypes.bool.isRequired,
  active: PropTypes.bool.isRequired,
  smallSize: PropTypes.bool.isRequired,
  style: PropTypes.object.isRequired,
  title: PropTypes.string,
}

DragItem.defaultProps = {
  data: null,
  title: '',
}

export default DragSource('metal', specSource, collectSource)(DragItem)
