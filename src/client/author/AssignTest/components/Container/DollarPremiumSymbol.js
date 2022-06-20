import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { white } from '@edulastic/colors'
import { IconStar } from '@edulastic/icons'

const DollarPremiumSymbol = ({ premium }) => {
  if (premium) return null
  return (
    <Link to="/author/subscription">
      <DollarSymbolWrapper>
        <IconStar />
      </DollarSymbolWrapper>
    </Link>
  )
}

export default DollarPremiumSymbol

const DollarSymbolWrapper = styled.span`
  display: ${({ premium }) => (!premium ? 'inline-block' : 'none')};
  color: ${white};
  margin-left: 10px;
  height: 22px;
  width: 22px;
  text-align: center;
  line-height: 22px;
  border-radius: 2px;
  font-weight: 400;
`
