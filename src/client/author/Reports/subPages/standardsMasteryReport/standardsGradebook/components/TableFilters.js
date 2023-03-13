import React, { useMemo } from 'react'
import next from 'immer'
import { Row, Col } from 'antd'

import { roleuser, reportUtils } from '@edulastic/constants'

import { StyledDropDownContainer } from './styled'
import { ControlDropDown } from '../../../../common/components/widgets/controlDropDown'

const {
  comDataForDropDown,
  compareByDropDownData: _compareByDropDownData,
  analyseByDropDownData,
} = reportUtils.standardsGradebook

const TableFilters = ({ userRole, tableFilters, tableFilterDropDownCB }) => {
  const compareByDropDownData = useMemo(
    () =>
      next(_compareByDropDownData, (arr) => {
        if (userRole === roleuser.TEACHER) {
          arr.splice(0, 2)
        }
      }),
    [userRole]
  )
  return (
    <Col xs={24} sm={24} md={14} lg={14} xl={12}>
      <Row className="control-dropdown-row" gutter={8}>
        <StyledDropDownContainer
          data-cy={comDataForDropDown.COMPARE_BY}
          xs={24}
          sm={24}
          md={11}
          lg={11}
          xl={8}
        >
          <ControlDropDown
            data={compareByDropDownData}
            by={tableFilters.compareByKey}
            prefix="Compare by "
            selectCB={tableFilterDropDownCB}
            comData={comDataForDropDown.COMPARE_BY}
          />
        </StyledDropDownContainer>
        <StyledDropDownContainer
          data-cy={comDataForDropDown.ANALYZE_BY}
          xs={24}
          sm={24}
          md={12}
          lg={12}
          xl={8}
        >
          <ControlDropDown
            data={analyseByDropDownData}
            by={tableFilters.analyseByKey}
            prefix="Analyze by "
            selectCB={tableFilterDropDownCB}
            comData={comDataForDropDown.ANALYZE_BY}
          />
        </StyledDropDownContainer>
      </Row>
    </Col>
  )
}

export default TableFilters
