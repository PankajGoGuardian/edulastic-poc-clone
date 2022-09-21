import React from 'react'
import styled from 'styled-components'
import { Tooltip } from 'antd'
import { greyThemeDark1 } from '@edulastic/colors'

const LargeTagParent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 8px;
  width: 190px;
  height: 32px;
  border-radius: 4px;
  ${(props) => (props.background ? `background: ${props.background};` : '')}
  color: ${(props) => props.color || greyThemeDark1} !important;
  div.left-text {
    font-weight: bold;
    max-width: 135px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  div.right-text {
    font-weight: bold;
  }
`

const LargeTag = (props) => {
  const {
    tooltipPlacement,
    tooltipText,
    leftText,
    rightText,
    leftStyle,
    rightStyle,
    ...restProps
  } = props

  const largeTag = (
    <LargeTagParent {...restProps}>
      <div className="left-text" style={leftStyle}>
        {leftText}
      </div>
      <div className="right-text" style={rightStyle}>
        {rightText}
      </div>
    </LargeTagParent>
  )

  return tooltipText ? (
    <Tooltip placement={tooltipPlacement || 'top'} title={tooltipText}>
      {largeTag}
    </Tooltip>
  ) : (
    largeTag
  )
}
export default LargeTag
