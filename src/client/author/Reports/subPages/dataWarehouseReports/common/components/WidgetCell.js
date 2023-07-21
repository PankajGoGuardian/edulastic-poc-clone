import { Row } from 'antd'
import React from 'react'
import { StyledCell } from './styledComponents'

const WidgetCell = ({
  header,
  subHeader,
  value,
  footer,
  color,
  cellType = 'medium',
  dataCy,
}) => {
  const headerClassName = subHeader ? 'small-header' : ''
  return (
    <div>
      <Row className={headerClassName} style={{ fontWeight: 'bold' }}>
        <div>{header}</div>
        <div>{subHeader}</div>
      </Row>
      <Row>
        <StyledCell data-cy={dataCy} cellType={cellType} color={color}>
          {value}
        </StyledCell>
      </Row>
      <Row>{footer}</Row>
    </div>
  )
}

export default WidgetCell
