import React from 'react'
import PropTypes from 'prop-types'

import { ControlDropDown } from '../../../../../common/components/widgets/controlDropDown'
import { StyledDropDownContainer } from '../../../../../common/styled'

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
    <>
      <StyledDropDownContainer
        data-cy="analyzeBy"
        xs={24}
        sm={12}
        md={12}
        lg={10}
        xl={8}
      >
        <ControlDropDown
          prefix="Analyze By"
          by={analyseBy}
          selectCB={onAnalyseByChange}
          data={dropDownData.analyseByData}
          isPageFilter
        />
      </StyledDropDownContainer>
      <StyledDropDownContainer
        data-cy="compareBy"
        xs={24}
        sm={12}
        md={12}
        lg={10}
        xl={8}
      >
        <ControlDropDown
          prefix="Compare By"
          by={compareBy}
          selectCB={onCompareByChange}
          data={compareByOptions}
          isPageFilter
        />
      </StyledDropDownContainer>
    </>
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
