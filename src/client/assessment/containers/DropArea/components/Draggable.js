import React from 'react'
import PropTypes from 'prop-types'
import { IconTrash } from '@edulastic/icons'
import { green, red, white } from '@edulastic/colors'
import { FlexContainer } from '@edulastic/common'
import { useDraggable } from '@dnd-kit/core'

import { IndexBox, CustomRnd, Pointer } from '../styled'

const Draggable = ({
  response,
  onDragStop,
  onDrag,
  onResize,
  onDelete,
  onClick,
  index,
  background,
  showDashedBorder,
  transparentBackground,
  showIndex = true,
  showBorder,
  responseHeight,
  responseWidth,
}) => {
  const { id } = response
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : {}

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        ...style,
        position: 'absolute',
        left: `${response.left}px`,
        top: `${response.top}px`,
        width: responseWidth,
        height: responseHeight,
      }}
    >
      <CustomRnd
        data-cy="drag-input"
        id={`drag-input-${index}`}
        background={background}
        showDashedBorder={showDashedBorder}
        showBorder={showBorder}
        transparentBackground={transparentBackground}
        onClick={onClick}
        onDragStop={onDragStop}
        onDrag={onDrag}
        onResize={onResize}
        // position={{ x: response.left, y: response.top }}
        size={{ width: responseWidth, height: responseHeight }}
      >
        <FlexContainer
          justifyContent="space-between"
          style={{ height: '100%' }}
        >
          {showIndex && <IndexBox isActive={response.active}>{index}</IndexBox>}
          <IconTrash
            onClick={onDelete}
            color={green}
            hoverColor={red}
            width={16}
            height={16}
            style={!showIndex ? { position: 'absolute', right: '10px' } : null}
          />
        </FlexContainer>
        {response.pointerPosition && response.pointerPosition !== 'none' && (
          <Pointer position={response.pointerPosition} />
        )}
      </CustomRnd>
    </div>
  )
}

Draggable.propTypes = {
  response: PropTypes.object.isRequired,
  onDrag: PropTypes.func.isRequired,
  onDragStop: PropTypes.func.isRequired,
  onResize: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  background: PropTypes.string,
  transparentBackground: PropTypes.bool,
  showDashedBorder: PropTypes.bool,
  showBorder: PropTypes.bool,
  showIndex: PropTypes.bool,
  responseHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  responseWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
}

Draggable.defaultProps = {
  background: white,
  transparentBackground: false,
  showDashedBorder: false,
  showIndex: false,
  showBorder: true,
}

export default Draggable
