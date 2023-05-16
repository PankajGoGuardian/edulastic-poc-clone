import { Col } from 'antd'
import React from 'react'

import { StyledH3 } from '../../../../common/styled'

const ChartHeader = () => (
  <Col xs={24} sm={24} md={12} lg={12} xl={12}>
    <StyledH3 margin="0 0 10px 50px">
      Mastery Level Distribution by Standard
    </StyledH3>
  </Col>
)

export default ChartHeader
