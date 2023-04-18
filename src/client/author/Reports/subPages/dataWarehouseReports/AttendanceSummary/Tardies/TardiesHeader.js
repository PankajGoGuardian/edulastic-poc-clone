import React from 'react'
import { Col, Row } from 'antd'
import {
  StyledSwitch,
  StyledSpan,
  StyledDiv,
  TardiesTitle,
} from '../styled-component'
import { groupByConstants } from '../utils/constants'

const TardiesHeader = ({ groupBy, setGroupBy }) => {
  return (
    <Row type="flex" justify="space-between">
      <Col>
        <TardiesTitle>Tardies</TardiesTitle>
      </Col>
      <Col>
        <StyledDiv>
          <StyledSpan>Weekly</StyledSpan>
          <StyledSwitch
            checked={groupBy === groupByConstants.MONTH}
            onChange={setGroupBy}
          />
          <StyledSpan>Monthly</StyledSpan>
        </StyledDiv>
      </Col>
    </Row>
  )
}
export default TardiesHeader
