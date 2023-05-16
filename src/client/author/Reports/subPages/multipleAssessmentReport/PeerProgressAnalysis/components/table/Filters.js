import React from 'react'
import PropTypes from 'prop-types'
import { Row } from 'antd'
import { ControlDropDown } from '../../../../../common/components/widgets/controlDropDown'
import dropDownData from '../../static/json/dropDownData.json'

const Filters = ({
  compareByOptions = [],
  onFilterChange,
  analyseBy,
  compareBy,
}) => {
  const onDropDownChange = (key) => (_, selectedItem) =>
    onFilterChange(key, selectedItem)

  const onCompareByChange = onDropDownChange('compareBy')
  const onAnalyseByChange = onDropDownChange('analyseBy')

  return (
    <Row type="flex" justify="end" align="middle" data-testid="filters">
      <ControlDropDown
        prefix="Analyze By"
        by={analyseBy}
        selectCB={onAnalyseByChange}
        data={dropDownData.analyseByData}
      />
      <ControlDropDown
        prefix="Compare By"
        by={compareBy}
        selectCB={onCompareByChange}
        data={compareByOptions}
      />
    </Row>
  )
}

const optionsShape = PropTypes.shape({
  key: PropTypes.string,
  title: PropTypes.string,
})

Filters.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  analyseBy: optionsShape,
  compareBy: optionsShape,
}

Filters.defaultProps = {
  analyseBy: dropDownData.analyseByData[0],
  compareBy: dropDownData.compareByData[0],
}

export default Filters
