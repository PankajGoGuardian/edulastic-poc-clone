import React from 'react'
import { Col } from 'antd'

import { reportUtils } from '@edulastic/constants'

import { StyledH3 } from '../../../../common/styled'

const { compareByKeyToNameMap } = reportUtils.standardsGradebook

const TableHeader = ({ tableFilters }) => {
  return (
    <Col xs={24} sm={24} md={10} lg={10} xl={12}>
      <StyledH3>
        Standards Mastery By {compareByKeyToNameMap[tableFilters.compareByKey]}
      </StyledH3>
    </Col>
  )
}

export default TableHeader
