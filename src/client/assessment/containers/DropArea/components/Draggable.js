import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { IconClose } from '@edulastic/icons'
import { greyThemeDark3, red, greyThemeLighter, white } from '@edulastic/colors'
import { FlexContainer } from '@edulastic/common'

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
  enableResizing,
  onToggleAddItem,
}) => {
  const hanldeMouseDownDelete = (evt) => {
    // prevent dragging and adding new one,
    // when click delete button at top-right
    evt.stopPropagation()
    if (typeof onToggleAddItem === 'function') {
      onToggleAddItem()
    }
  }

  return (
    <CustomRnd
      data-cy="drag-input"
      id={`drag-input-${index}`}
      background={background}
      showDashedBorder={showDashedBorder}
      showBorder={showBorder}
      transparentBackground={transparentBackground}
      onClick={onClick}
      onResizeStart={onToggleAddItem}
      onDragStart={onToggleAddItem}
      onDragStop={onDragStop}
      onDrag={onDrag}
      onResize={onResize}
      enableResizing={enableResizing}
      resizeHandleStyles={{ bottomRight: { zIndex: 1000 } }}
      position={{ x: response.left, y: response.top }}
      size={{ width: responseWidth, height: responseHeight }}
    >
      <FlexContainer justifyContent="space-between" style={{ height: '100%' }}>
        {showIndex && <IndexBox isActive={response.active}>{index}</IndexBox>}
        <DeleteButton onClick={onDelete} onMouseDown={hanldeMouseDownDelete}>
          <IconClose />
        </DeleteButton>
      </FlexContainer>
      {response.pointerPosition && response.pointerPosition !== 'none' && (
        <Pointer position={response.pointerPosition} />
      )}
    </CustomRnd>
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
  enableResizing: PropTypes.object,
}

Draggable.defaultProps = {
  background: white,
  transparentBackground: false,
  showDashedBorder: false,
  showIndex: false,
  showBorder: true,
  enableResizing: {
    bottom: true,
    bottomLeft: true,
    bottomRight: true,
    left: true,
    right: true,
    top: true,
    topLeft: true,
    topRight: true,
  },
}

export default Draggable

const DeleteButton = styled.div`
  width: 16px;
  height: 16px;
  position: absolute;
  border: 1px solid;
  border-color: ${greyThemeDark3};
  border-radius: 50%;
  left: -9px;
  top: -9px;
  cursor: pointer;
  background-color: ${greyThemeLighter};

  & svg {
    top: 50%;
    left: 50%;
    position: absolute;
    transform: translate(-50%, -50%);
    width: 8px;
    min-width: 8px;
    fill: ${greyThemeDark3};
  }

  &:hover {
    border-color: ${red};

    svg {
      fill: ${red};
    }
  }
`
