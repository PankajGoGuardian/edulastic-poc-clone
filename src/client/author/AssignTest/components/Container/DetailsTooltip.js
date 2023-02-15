import React from 'react'
import styled from 'styled-components'
import {
  white,
  greyThemeDark6,
  premiumBg,
  mainTextColor,
} from '@edulastic/colors'
import { IconStar } from '@edulastic/icons'

const DetailsTooltip = ({
  title,
  content,
  placement,
  premium,
  showInsideContainer,
  width,
}) => {
  let yShift = '-32%'
  if (placement === 'rightTop') yShift = 'calc( -100% + 30px )'
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
      <span className="popover-title">{title}</span>
      {!premium && (
        <span className="premium-tag">
          <span className="premium-icon">
            <IconStar />
          </span>
          <span className="premium-text">Premium</span>
        </span>
      )}
      <span className="popover-body">{content}</span>
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
    width: 80px;
    height: 22px;
    border-radius: 5px;
    text-transform: uppercase;
    text-align: left;
    margin-bottom: 5px;
  }
  > .premium-icon,
  .premium-text {
    vertical-align: top;
    display: inline-block;
  }
  > .popover-body {
    color: ${mainTextColor};
    font-weight: 500;
  }
`
