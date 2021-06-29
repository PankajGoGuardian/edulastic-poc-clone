import React from 'react'
import { SettingContainer as SettingContainerWrapper } from './styled'

const SettingContainer = ({ children, id }) => {
  const handleMouseOver = (e) => {
    const showPopover = e.currentTarget.querySelector('.popover')
    if (showPopover) {
      showPopover.style.display = 'flex'
    }
  }

  const handleMouseOut = (e) => {
    const showPopover = e.currentTarget.querySelector('.popover')
    if (showPopover) {
      showPopover.style.display = 'none'
    }
  }

  return (
    <SettingContainerWrapper
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      id={id}
    >
      {children}
    </SettingContainerWrapper>
  )
}

export default SettingContainer
