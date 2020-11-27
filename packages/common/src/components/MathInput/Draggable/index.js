import React from 'react'
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
    this.mounted = true
    // Touch handlers must be added with {passive: false} to be cancelable.
    // https://developers.google.com/web/updates/2017/01/scrolling-intervention
    const thisNode = this.findDOMNode()
    if (thisNode) {
      thisNode.addEventListener('touchstart', this.onDragStart, {
        passive: false,
      })
    }
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
    e.stopPropagation()
    e.preventDefault()
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
    this.setState({ isDragging: false }, () => {
      this.delta.current = null
      document.removeEventListener('mousemove', this.onDrag, {
        capture: true,
      })
      document.removeEventListener('touchmove', this.onDrag, { passive: false })
    })
  }

  render() {
    const { children } = this.props
    return (
      <DraggableContainer
        onMouseDown={this.onDragStart}
        onMouseUp={this.onDragStop}
        onTouchEnd={this.onDragStop}
        ref={this.containerRef}
      >
        {children}
      </DraggableContainer>
    )
  }
}

export default Draggable

const DraggableContainer = styled.div`
  box-shadow: ${boxShadowDefault};
  position: fixed;
  z-index: 1100;
`
