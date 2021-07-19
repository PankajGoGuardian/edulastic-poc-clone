import React, { useState } from 'react'
import { IconGraphRightArrow, IconChevronLeft } from '@edulastic/icons'
import {
  CollapseBtn,
  Divider,
} from '../../../src/components/common/PreviewModal/styled'

const PassageDivider = ({ collapseDirection, onChange }) => {
  const [showCollapse, setShowCollapse] = useState(false)
  const isCollapsed = !!collapseDirection

  return (
    <Divider
      isCollapsed={isCollapsed}
      collapseDirection={collapseDirection}
      onMouseEnter={() => setShowCollapse(true)}
      onMouseLeave={() => setShowCollapse(false)}
    >
      {(isCollapsed || showCollapse) && (
        <div className="button-wrapper">
          <CollapseBtn
            collapseDirection={collapseDirection}
            onClick={() => onChange('left')}
            left
          >
            <IconChevronLeft />
          </CollapseBtn>
          <CollapseBtn collapseDirection={collapseDirection} mid>
            <div className="vertical-line first" />
            <div className="vertical-line second" />
            <div className="vertical-line third" />
          </CollapseBtn>
          <CollapseBtn
            collapseDirection={collapseDirection}
            onClick={() => onChange('right')}
            right
          >
            <IconGraphRightArrow />
          </CollapseBtn>
        </div>
      )}
    </Divider>
  )
}

export default PassageDivider
