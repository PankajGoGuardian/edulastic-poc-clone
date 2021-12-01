import React from 'react'
import { IconGraphRightArrow, IconChevronLeft } from '@edulastic/icons'
import { Container } from './styled'

const PassageDivider = ({ viewComponent, collapseDirection, onChange }) => {
  const handleOnClick = (dir) => () => {
    if (dir !== collapseDirection) {
      onChange(dir)
    }
  }

  return (
    <Container
      dir={collapseDirection}
      isInModal={viewComponent === 'authorPreviewPopup'}
      data-cy="dividerButton"
      data-test={collapseDirection}
    >
      <div className="collapse left" onClick={handleOnClick('left')}>
        <IconChevronLeft />
      </div>
      <div className="vertical-lines" onClick={handleOnClick('')}>
        <div className="vertical-line" />
        <div className="vertical-line" />
        <div className="vertical-line" />
      </div>
      <div className="collapse right" onClick={handleOnClick('right')}>
        <IconGraphRightArrow />
      </div>
    </Container>
  )
}

export default PassageDivider
