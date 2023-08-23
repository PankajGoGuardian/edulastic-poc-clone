import React from 'react'
import { Row } from 'antd'
import next from 'immer'

import { ControlDropDown } from '../../../../../common/components/widgets/controlDropDown'
import { StyledDropDownContainer } from '../../../../../common/styled'

const TableFilters = ({
  tableFiltersDropDownData,
  tableFilters,
  setTableFilters,
}) => {
  const {
    analyseByDropDownData,
    compareByDropDownData,
  } = tableFiltersDropDownData

  const onChangeTableFilters = (prefix, options, selectedPayload) => {
    const modifiedState = next(tableFilters, (draft) => {
      draft[prefix] =
        options.find((option) => option.key === selectedPayload.key) ||
        options[0]
      draft.rowPage = 1
    })
    setTableFilters(modifiedState)
  }

  const bindOnChange = (prefix, options) => (props) =>
    onChangeTableFilters(prefix, options, props)

  return (
    <Row className="control-dropdown-row">
      <StyledDropDownContainer
        data-cy="compareBy"
        xs={24}
        sm={24}
        md={12}
        lg={12}
        xl={12}
      >
        <ControlDropDown
          prefix="Compare by "
          data={compareByDropDownData}
          by={tableFilters.compareBy}
          selectCB={bindOnChange('compareBy', compareByDropDownData)}
        />
      </StyledDropDownContainer>
      <StyledDropDownContainer
        data-cy="analyzeBy"
        xs={24}
        sm={24}
        md={12}
        lg={12}
        xl={12}
      >
        <ControlDropDown
          prefix="Analyze by "
          data={analyseByDropDownData}
          by={tableFilters.analyseBy}
          selectCB={bindOnChange('analyseBy', analyseByDropDownData)}
        />
      </StyledDropDownContainer>
    </Row>
  )
}

export default TableFilters
