import React from 'react'
import { Rnd } from 'react-rnd'
import get from 'lodash/get'

import { FlexContainer } from '@edulastic/common'
import { DropContainer } from '../../Classification/styled/DropContainer'
import { CustomStyleBtn } from '../../../styled/ButtonStyles'

const Enable = {
  bottomLeft: true,
  bottomRight: true,
  topLeft: true,
  topRight: true,
  bottom: true,
  left: true,
  right: true,
  top: true,
}

export default function BackgroundImage({
  dragItem,
  imageOptions,
  t,
  handleDrag,
  handleResize,
  handleDragAndResizeStop,
  imageUrl,
  deleteBgImg,
}) {
  const imageOptionWidth = get(imageOptions, 'width')
  const imageOptionHeight = get(imageOptions, 'height')
  const isBgImageMaximized = imageOptionWidth >= 700 || imageOptionHeight >= 600

  return (
    <FlexContainer flexDirection="column">
      <DropContainer>
        <Rnd
          size={{
            width: dragItem.width || '100%',
            height: dragItem.height || '100%',
          }}
          enableResizing={Enable}
          style={{
            zIndex: 10,
            backgroundImage: `url(${imageUrl})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: isBgImageMaximized
              ? '100% 100%'
              : `${imageOptions.width}px ${imageOptions.height}px`,
          }}
          position={{ x: dragItem.x, y: dragItem.y }}
          onDragStop={handleDrag}
          onResize={handleResize}
          onResizeStop={handleDragAndResizeStop}
          bounds="parent"
        />
      </DropContainer>
      <CustomStyleBtn onClick={deleteBgImg}>
        {t('component.classification.deleteBackImage')}
      </CustomStyleBtn>
    </FlexContainer>
  )
}
