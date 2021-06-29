import React from 'react'
import { SettingContainer as SettingContainerWrapper } from './styled'

const SettingContainer = ({ children, id }) => {
  const handleMouseOver = (e) => {
    e.currentTarget.querySelector('.popover').style.display = 'flex'
  }

  const handleMouseOut = (e) => {
    e.currentTarget.querySelector('.popover').style.display = 'none'
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
