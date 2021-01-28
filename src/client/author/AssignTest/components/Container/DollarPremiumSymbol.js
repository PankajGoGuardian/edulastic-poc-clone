import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { white, premiumBg } from '@edulastic/colors'

const DollarPremiumSymbol = ({ premium }) => {
  if (premium) return null
  return (
    <Link to="/author/subscription">
      <DollarSymbolWrapper>$</DollarSymbolWrapper>
    </Link>
  )
}

export default DollarPremiumSymbol

const DollarSymbolWrapper = styled.span`
  display: ${({ premium }) => (!premium ? 'inline-block' : 'none')};
  color: ${white};
  margin-left: 10px;
  background: ${premiumBg};
  font-size: 12px;
  height: 22px;
  width: 22px;
  text-align: center;
  line-height: 22px;
  border-radius: 2px;
`
