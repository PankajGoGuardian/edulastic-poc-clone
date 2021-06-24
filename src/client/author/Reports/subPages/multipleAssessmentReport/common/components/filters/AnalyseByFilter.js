import React from 'react'
import PropTypes from 'prop-types'

import { ControlDropDown } from '../../../../../common/components/widgets/controlDropDown'
import { StyledDropDownContainer } from '../../../../../common/styled'

import analyseByData from '../../static/json/analyseByDropDown.json'

const AnalyseByFilter = ({ onFilterChange, analyseBy }) => {
  const onAnalyseByChange = (_, selectedItem) => onFilterChange(selectedItem)

  return (
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
        data={analyseByData}
        isPageFilter
      />
    </StyledDropDownContainer>
  )
}

AnalyseByFilter.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  analyseBy: PropTypes.shape({
    key: PropTypes.string,
    title: PropTypes.string,
  }),
}

AnalyseByFilter.defaultProps = {
  analyseBy: analyseByData[0],
}

export default AnalyseByFilter
