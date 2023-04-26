import React from 'react'
import styled from 'styled-components'
import { isEmpty } from 'lodash'
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
    width: 35px;
    text-align: right;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    @media print {
      white-space: normal;
    }
  }
  div.right-text {
    font-weight: bold;
  }
`

const LargeTag = (props) => {
  const {
    CustomTooltip = Tooltip,
    tooltipPlacement,
    tooltipText,
    leftText,
    rightText,
    leftStyle,
    rightStyle,
    ...restProps
  } = props
  const justifyContent = isEmpty(leftText) ? 'center' : 'space-between'

  const largeTag = (
    <LargeTagParent {...restProps} style={{ justifyContent }}>
      <div className="left-text" style={leftStyle}>
        {leftText}
      </div>
      <div className="right-text" style={rightStyle}>
        {rightText}
      </div>
    </LargeTagParent>
  )

  return tooltipText ? (
    <CustomTooltip
      placement={tooltipPlacement || 'top'}
      title={tooltipText}
      getPopupContainer={(triggerNode) => triggerNode}
    >
      {largeTag}
    </CustomTooltip>
  ) : (
    largeTag
  )
}

export default LargeTag
