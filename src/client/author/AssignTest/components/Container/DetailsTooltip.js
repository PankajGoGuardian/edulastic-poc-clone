import React from 'react'
import styled from 'styled-components'
import { white, greyThemeDark6, premiumBg } from '@edulastic/colors'

const DetailsTooltip = ({
  title,
  content,
  placement,
  premium,
  showInsideContainer,
  width,
}) => {
  let yShift = '-32%'
  if (placement === 'rightTop') yShift = '-80%'
  if (placement === 'rightBottom') yShift = '0%'

  let xShift = '108%'
  if (showInsideContainer) xShift = '-20%'

  return (
    <StyledPopOver
      className="popover"
      yShift={yShift}
      xShift={xShift}
      width={width}
    >
      <span>{title}</span>
      {!premium && <span className="premium-tag">$ Premium</span>}
      <span>{content}</span>
    </StyledPopOver>
  )
}

export default DetailsTooltip

const StyledPopOver = styled.div`
  width: ${({ width }) => (width ? `${width}px` : '240px')};
  position: absolute;
  right: 0;
  background: ${white};
  z-index: 1000;
  flex-direction: column;
  box-shadow: 0px 2px 5px #00000012;
  padding: 20px;
  font-size: 12px;
  border: 1px solid #d8d8d8;
  border-radius: 6px;
  display: none;
  transform: ${({ xShift, yShift }) => `translate(${xShift}, ${yShift})`};
  > span:first-child {
    color: ${greyThemeDark6};
    margin-bottom: 4px;
    text-transform: uppercase;
    font-weight: 600;
  }
  > .premium-tag {
    font-weight: bold;
    font-size: 9px;
    line-height: 22px;
    display: inline-block;
    color: ${white};
    background: ${premiumBg};
    width: 77px;
    height: 22px;
    border-radius: 5px;
    text-transform: uppercase;
    text-align: center;
    margin-bottom: 5px;
  }
`
