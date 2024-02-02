/* eslint-disable react/prop-types */
import React from 'react'
import { StyledCheckbox } from './styled'

const CardCheckbox = ({ checked = false, onChange = undefined }) => {
  return (
    <StyledCheckbox className="aabbcc" checked={checked} onChange={onChange} />
  )
}

export default CardCheckbox
