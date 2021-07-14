import React, { useState } from 'react'
import { IconGraphRightArrow, IconChevronLeft } from '@edulastic/icons'
import { CollapseBtn, Divider } from './styled'

const DividerContainer = ({
  collapseDirection,
  setCollapseView,
  hideMiddle,
  stackedView,
}) => {
  const [showCollapse, setShowCollapse] = useState(false)

  return (
    <Divider
      isCollapsed={!!collapseDirection}
      collapseDirection={collapseDirection}
      hideMiddle={hideMiddle}
      stackedView={stackedView}
      onMouseEnter={() => setShowCollapse(true)}
      onMouseLeave={() => setShowCollapse(false)}
    >
      {showCollapse && (
        <div
          data-cy="dividerButton"
          data-test={collapseDirection}
          className="button-wrapper"
        >
          <CollapseBtn
            collapseDirection={collapseDirection}
            onClick={() => setCollapseView('left')}
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
            onClick={() => setCollapseView('right')}
            right
          >
            <IconGraphRightArrow />
          </CollapseBtn>
        </div>
      )}
    </Divider>
  )
}

export default DividerContainer
