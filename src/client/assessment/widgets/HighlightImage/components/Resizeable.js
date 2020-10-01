import React, { useRef } from 'react'
import { Rnd } from 'react-rnd'
import PropTypes from 'prop-types'

import { MoveControlButton } from '../../ClozeImageText/styled/ControlButton'
import { IconMoveResize } from '../../ClozeImageText/styled/IconMoveResize'

const Resizeable = ({
  x,
  y,
  height,
  width,
  src,
  altText,
  handleResizing,
  handleDragStop,
}) => {
  const containerDimensions = {
    width: Math.max(x + width + 10, 700),
    height: Math.max(y + height + 10, 600),
  }

  const wrapperRef = useRef(null)

  return (
    <div
      ref={wrapperRef}
      style={{
        position: `relative`,
        width: `${containerDimensions.width}px`,
        height: `${containerDimensions.height}px`,
        marginRight: 'auto',
      }}
    >
      <Rnd
        onResize={handleResizing}
        onDragStop={handleDragStop}
        size={{ height, width }}
        position={{ x: Math.max(5, x), y: Math.max(5, y) }}
        enableResizing={{
          bottom: false,
          bottomLeft: false,
          bottomRight: true,
          left: false,
          right: false,
          top: false,
          topLeft: false,
          topRight: false,
        }}
      >
        <div
          data-cy="previewImage"
          style={{
            backgroundImage: `url(${src})`,
            backgroundSize: `${width}px ${height}px`,
            backgroundRepeat: `no-repeat`,
            width: `100%`,
            height: `100%`,
          }}
        />
        <MoveControlButton>
          <IconMoveResize />
        </MoveControlButton>
      </Rnd>
    </div>
  )
}

Resizeable.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  src: PropTypes.string.isRequired,
  altText: PropTypes.string,
  handleResizing: PropTypes.func.isRequired,
  handleDragStop: PropTypes.func.isRequired,
}

Resizeable.defaultProps = {
  x: 0,
  y: 0,
  altText: '',
}

export default Resizeable
