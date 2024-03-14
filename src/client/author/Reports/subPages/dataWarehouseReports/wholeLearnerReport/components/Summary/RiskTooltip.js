import { RISK_BAND } from '@edulastic/constants/reportUtils/common'
import React from 'react'
import { Col, Row } from 'antd'
import { isEmpty } from 'lodash'
import { ColoredText } from '../../../common/components/styledComponents'

const TooltipRow = ({ data }) => {
  if (isEmpty(data)) return null
  const { subject, scoreLabel, riskBandLabel, riskBandLevel } = data
  const riskLabel = RISK_BAND[riskBandLabel].label
  const riskLabelText = ` (${riskLabel} - ${riskBandLevel.toFixed(1)})`
  return (
    <Row type="flex" gutter={[5, 5]} align="middle">
      <Col>
        <ColoredText $fontSize="12px" $fontWeight={600}>
          {subject} - {scoreLabel}
        </ColoredText>
      </Col>
      <Col>
        <ColoredText
          $color={RISK_BAND[riskBandLabel].secondaryColor}
          $fontSize="12px"
          $fontWeight={600}
        >
          {riskLabelText}
        </ColoredText>
      </Col>
    </Row>
  )
}

const RiskTooltip = ({ data = [] }) => (
  <div>
    {data.map((d) => (
      <TooltipRow data={d} />
    ))}
  </div>
)

export default RiskTooltip
