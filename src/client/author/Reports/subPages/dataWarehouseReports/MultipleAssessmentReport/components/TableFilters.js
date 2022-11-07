import React from 'react'
import PropTypes from 'prop-types'
import { Row, Tooltip } from 'antd'
import { IconInfo } from '@edulastic/icons'
import { ControlDropDown } from '../../../../common/components/widgets/controlDropDown'
import { StyledH3 } from '../../../../common/styled'

const TableFilters = ({
  updateFilterDropdownCB,
  compareByOptions = [],
  selectedCompareBy,
}) => {
  return (
    <Row
      style={{ gap: '8px' }}
      type="flex"
      justify="space-between"
      align="middle"
    >
      <StyledH3 margin="0">
        Performance by {selectedCompareBy?.title || '-'}
      </StyledH3>
      <Tooltip title="This table shows the median score and the performance band of students across assessments">
        <IconInfo />
      </Tooltip>
      <div style={{ flex: 1 }} />
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
