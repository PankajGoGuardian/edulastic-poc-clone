import React, { useState } from 'react'
import { IconGraphRightArrow, IconChevronLeft } from '@edulastic/icons'
import { CollapseBtn, Divider } from './styled'

const DividerContainer = ({
  collapseDirection,
  setCollapseView,
  hideMiddle,
  stackedView,
  isStudentReport,
}) => {
  const [showCollapse, setShowCollapse] = useState(hideMiddle)
  const isCollapsed = !!collapseDirection

  const handleToggleCollapse = (val) => () => {
    if (!hideMiddle) {
      setShowCollapse(val)
    }
  }

  return (
    <Divider
      isCollapsed={isCollapsed && !hideMiddle}
      collapseDirection={collapseDirection}
      hideMiddle={hideMiddle || isCollapsed}
      stackedView={isStudentReport || stackedView}
      onMouseEnter={handleToggleCollapse(true)}
      onMouseLeave={handleToggleCollapse(false)}
    >
      {(showCollapse || isCollapsed) && (
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
