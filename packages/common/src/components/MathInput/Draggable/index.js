import React from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'
import { boxShadowDefault } from '@edulastic/colors'

import {
  getTouchIdentifier,
  getControlPosition,
  getBoundPosition,
  createCSSTransform,
} from './helpers'

class Draggable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      position: {},
      isDragging: false,
      touchIdentifier: null,
    }
    this.containerRef = React.createRef()
    this.delta = React.createRef({
      x: 0,
      y: 0,
    })
    this.mounted = false
  }

  componentDidMount() {
    const { position = {} } = this.props

    this.mounted = true
    // Touch handlers must be added with {passive: false} to be cancelable.
    // https://developers.google.com/web/updates/2017/01/scrolling-intervention
    const thisNode = this.findDOMNode()
    if (thisNode) {
      thisNode.addEventListener('touchstart', this.onDragStart, {
        passive: false,
      })
    }
    this.setState({ position })
  }

  componentWillUnmount() {
    this.mounted = false
    const thisNode = this.findDOMNode()
    thisNode.removeEventListener('touchstart', this.onDragStart, {
      passive: false,
    })
    document.removeEventListener('mousemove', this.onDrag, {
      capture: true,
    })
  }

  findDOMNode() {
    return this.containerRef.current
  }

  onDrag = (e) => {
    const { touchIdentifier, isDragging } = this.state
    const position = getControlPosition(e, touchIdentifier, this)
    if (position == null) {
      return
    }
    const { x, y } = position
    const transformStyle = createCSSTransform(this.delta.current)
    if (isDragging && this.containerRef.current) {
      this.containerRef.current.style.left = `${x}px`
      this.containerRef.current.style.top = `${y}px`
      this.containerRef.current.style[transformStyle.key] = transformStyle.value
    }
  }

  onDragStart = (e) => {
    const { disabled } = this.props

    const thisNode = this.findDOMNode()
    const { ownerDocument } = thisNode

    if (disabled || !(e.target instanceof ownerDocument.defaultView.Node)) {
      return
    }

    // Prevent scrolling on mobile devices, like ipad/iphone.
    // Important that this is after handle/cancel.
    if (e.type === 'touchstart' && !e.target.onclick) e.preventDefault()
    if (this.mounted === false) {
      return
    }
    const touchIdentifier = getTouchIdentifier(e)
    this.setState({ touchIdentifier })

    const position = getBoundPosition(e, touchIdentifier, this)

    if (position == null) {
      return
    }

    this.delta.current = {
      x: -position.x,
      y: -position.y,
    }

    this.setState({ isDragging: true }, () => {
      document.addEventListener('mousemove', this.onDrag, {
        capture: true,
      })
      document.addEventListener('touchmove', this.onDrag, { passive: false })
    })
  }

  onDragStop = () => {
    const { onDragStop } = this.props

    if (typeof onDragStop === 'function') {
      const lastX = parseInt(this.containerRef.current.style.left, 10)
      const lastY = parseInt(this.containerRef.current.style.top, 10)
      onDragStop({ x: lastX, y: lastY })
    }

    this.setState({ isDragging: false }, () => {
      this.delta.current = null
      document.removeEventListener('mousemove', this.onDrag, {
        capture: true,
      })
      document.removeEventListener('touchmove', this.onDrag, { passive: false })
    })
  }

  render() {
    const {
      children,
      usePortal,
      transform,
      borderRadius = 0,
      width = '',
      minHeight = '',
    } = this.props
    const { position = {} } = this.state

    const content = (
      <DraggableContainer
        onMouseDown={this.onDragStart}
        onMouseUp={this.onDragStop}
        onTouchEnd={this.onDragStop}
        left={position.x}
        top={position.y}
        transform={transform}
        width={width}
        minHeight={minHeight}
        borderRadius={borderRadius}
        ref={this.containerRef}
      >
        {children}
      </DraggableContainer>
    )
    if (usePortal) {
      return createPortal(content, document.body)
    }
    return content
  }
}

export default Draggable

const DraggableContainer = styled.div.attrs(
  ({ left, top, transform, borderRadius, width, minHeight }) => ({
    style: {
      left,
      top,
      transform,
      borderRadius,
      width,
      minHeight,
    },
  })
)`
  box-shadow: ${boxShadowDefault};
  position: fixed;
  z-index: 1100;
  cursor: move;
`
