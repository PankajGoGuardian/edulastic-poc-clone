import { Tooltip } from 'antd'
import React from 'react'
import styled from 'styled-components'

const EllipsisTextWithTooltip = ({
  text,
  toolTipMsg,
  toolTipProps,
  showToolTip = true,
}) => {
  if (showToolTip) {
    return (
      <Tooltip title={toolTipMsg} {...toolTipProps}>
        <Text>{text || '-'}</Text>
      </Tooltip>
    )
  }
  return <Text>{text}</Text>
}

export default EllipsisTextWithTooltip

const Text = styled.p`
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  color: #434b5d;
`
