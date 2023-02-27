import { Row } from 'antd'
import React from 'react'
import { ControlDropDown } from '../../../../../common/components/widgets/controlDropDown'
import SectionLabel from '../../../../../common/components/SectionLabel'
import { compareByOptions } from '../../../../multipleAssessmentReport/PreVsPost/utils'

const DashboardTableFilters = ({ selectedTableFilter }) => {
  return (
    <Row
      type="flex"
      style={{
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <SectionLabel>Performance By School</SectionLabel>
      <ControlDropDown
        height="40px"
        style={{ marginRight: '10px' }}
        prefix="Compare By"
        by={selectedTableFilter}
        selectCB={() => {}}
        data={compareByOptions}
      />
    </Row>
  )
}

export default DashboardTableFilters
