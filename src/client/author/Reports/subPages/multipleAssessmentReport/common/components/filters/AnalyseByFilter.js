import React from 'react'
import PropTypes from 'prop-types'
import { Row } from 'antd'
import { ControlDropDown } from '../../../../../common/components/widgets/controlDropDown'
import analyseByData from '../../static/json/analyseByDropDown.json'

const AnalyseByFilter = ({ onFilterChange, analyseBy, data }) => {
  const onAnalyseByChange = (_, selectedItem) => onFilterChange(selectedItem)

  return (
    <Row type="flex" justify="end" align="middle">
      <ControlDropDown
        prefix="Analyze By"
        by={analyseBy}
        selectCB={onAnalyseByChange}
        data={data || analyseByData}
      />
    </Row>
  )
}

AnalyseByFilter.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  analyseBy: PropTypes.shape({
    key: PropTypes.string,
    title: PropTypes.string,
  }),
  data: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    })
  ),
}

AnalyseByFilter.defaultProps = {
  analyseBy: analyseByData[0],
  data: null,
}

export default AnalyseByFilter
