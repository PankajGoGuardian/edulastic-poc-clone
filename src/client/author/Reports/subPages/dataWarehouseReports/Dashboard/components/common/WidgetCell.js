import { EduIf } from '@edulastic/common'
import { IconCarets } from '@edulastic/icons'
import { Row } from 'antd'
import React from 'react'
import { StyledCell, SubFooter } from './styledComponents'

const WidgetCell = ({
  header,
  subHeader,
  value,
  subValue,
  footer,
  subFooter,
  color,
  cellType = 'medium',
}) => {
  const headerClassName = subHeader ? 'small-header' : ''
  return (
    <div>
      <div className={headerClassName}>
        <div>{header}</div>
        <div>{subHeader}</div>
      </div>
      <Row type="flex">
        <StyledCell fill cellType={cellType} color={color}>
          {value}
        </StyledCell>
        <EduIf condition={!!subValue}>
          <StyledCell color={color} cellType={cellType}>
            {subValue}
          </StyledCell>
        </EduIf>
      </Row>
      <EduIf condition={!!footer}>
        <div>
          {footer} <IconCarets.IconCaretUp />
        </div>
      </EduIf>
      <EduIf condition={!!subFooter}>
        <SubFooter>{subFooter}</SubFooter>
      </EduIf>
    </div>
  )
}

export default WidgetCell
