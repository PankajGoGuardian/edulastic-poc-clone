import React from 'react'
import { Tooltip } from 'antd'
import styled from 'styled-components'
import { greyThemeDark1, black, white } from '@edulastic/colors'

const CustomTableTooltip = (props) => {
  const {
    className,
    overlayClassName = '',
    getCellContents,
    columnKey,
    ...attrs
  } = props

  return (
    <Tooltip
      {...attrs}
      overlayClassName={`custom-table-tooltip ${overlayClassName} ${className}`}
    >
      {getCellContents(props)}
    </Tooltip>
  )
}

const CustomWhiteBackgroundTooltip = ({ data, str }) => (
  <StyledContainer className="test-container">
    <Tooltip
      title={data || ''}
      getPopupContainer={(triggerNode) => triggerNode}
    >
      <StyledSpan>{str}</StyledSpan>
    </Tooltip>
  </StyledContainer>
)

const StyledCustomTableTooltip = styled(CustomTableTooltip)`
  max-width: 500px;

  .ant-tooltip-content {
    .ant-tooltip-arrow {
      border-top-color: white;
    }
    .ant-tooltip-inner {
      text-align: ${({ $textAlign }) => $textAlign || 'center'};
      background-color: white;
      color: ${black};
      .custom-table-tooltip-value {
        font-weight: 900;
        margin-left: 5px;
      }
    }
  }
`

export const StyledSpan = styled.span`
  cursor: default;
  font: 12px/17px Open Sans;
  font-weight: 600;
  letter-spacing: 0px;
  color: ${greyThemeDark1};
  text-align: left;
  &:hover {
    color: ${greyThemeDark1};
  }
`

const StyledContainer = styled.div`
  .ant-tooltip-inner {
    background-color: ${white};
    color: ${black};
    text-align: left;
  }
`
export {
  StyledCustomTableTooltip as CustomTableTooltip,
  CustomWhiteBackgroundTooltip,
}
