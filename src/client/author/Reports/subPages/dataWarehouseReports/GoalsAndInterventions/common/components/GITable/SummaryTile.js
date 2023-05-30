import React from 'react'
import styled from 'styled-components'
import Popover from 'antd/lib/popover'
import { EduIf } from '@edulastic/common'
import { summaryTileColors } from '../../../constants/common'
import { StyledInfoIcon } from './styled-components'

const SummaryTile = ({
  id,
  text,
  unit,
  color,
  border,
  textColor = summaryTileColors.BLUE_TEXT,
  infoText = '',
  status_code,
  handleClick,
  selectedStatus,
}) => {
  return (
    <StyleButton
      key={id}
      style={{
        background: color,
        border: border || 'none',
        color: textColor,
        textTransform: border ? 'uppercase' : 'initial',
        fontSize: border ? '14px' : '12px',
        boxShadow: selectedStatus === status_code ? `0 0 8px #ccc` : 'none',
      }}
      onClick={() => handleClick(status_code)}
    >
      <p>
        {text}
        <EduIf condition={infoText?.length > 0}>
          <Popover
            overlayClassName="gi-summary-tile-info-popover"
            placement="top"
            content={
              <div className="content">
                <p>{infoText}</p>
              </div>
            }
          >
            <StyledInfoIcon />
          </Popover>
        </EduIf>
      </p>
      <b>{unit}</b>
    </StyleButton>
  )
}

const StyleButton = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  height: 60px;
  min-width: 10vw;
  border-radius: 4px;
  cursor: pointer;
  p {
    font-weight: 600;
  }
  b {
    font-weight: 700;
    font-size: 16px;
  }
`

export default SummaryTile
