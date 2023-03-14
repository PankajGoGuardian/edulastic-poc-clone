import React from 'react'
import PropTypes from 'prop-types'
import { Row } from 'antd'
import { ControlDropDown } from '../../../../common/components/widgets/controlDropDown'
import { StyledH3 } from '../../../../common/styled'

const TableFilters = ({
  updateFilterDropdownCB,
  compareByOptions = [],
  selectedCompareBy,
}) => {
  return (
    <Row
      type="flex"
      justify="space-between"
      align="middle"
      style={{ marginTop: 45 }}
    >
      <StyledH3>
        Performance Deep-dive across Assessments by{' '}
        {selectedCompareBy?.title || '-'}
      </StyledH3>
      <ControlDropDown
        prefix="Compare By"
        by={selectedCompareBy}
        selectCB={(e, selected) =>
          updateFilterDropdownCB(selected, 'compareBy')
        }
        data={compareByOptions}
      />
    </Row>
  )
}

const optionsShape = PropTypes.shape({
  key: PropTypes.string,
  title: PropTypes.string,
})

TableFilters.propTypes = {
  updateFilterDropdownCB: PropTypes.func.isRequired,
  selectedCompareBy: optionsShape.isRequired,
}

export default TableFilters
